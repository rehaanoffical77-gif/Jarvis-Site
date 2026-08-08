import React, { useEffect, useRef } from 'react';

interface FallingBeamsCanvasProps {
  color?: string; // hex color e.g. '#c379ff' or '#ffffff' or '#38bdf8'
  className?: string;
}

export const FallingBeamsCanvas: React.FC<FallingBeamsCanvasProps> = ({
  color = '#c379ff',
  className = 'absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60 mix-blend-screen',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: false,
    });

    if (!gl) return;

    // Enable OES_standard_derivatives extension for fwidth in WebGL1
    gl.getExtension('OES_standard_derivatives');

    const vertSrc = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragSrc = `
      #ifdef GL_ES
      #extension GL_OES_standard_derivatives : enable
      #endif
      precision highp float;
      precision mediump int;
      
      uniform float iTime;
      uniform vec3 iResolution;
      uniform vec4 iMouse;
      uniform float uWispDensity;
      uniform float uTiltScale;
      uniform float uFlowTime;
      uniform float uFogTime;
      uniform float uBeamXFrac;
      uniform float uBeamYFrac;
      uniform float uFlowSpeed;
      uniform float uVLenFactor;
      uniform float uHLenFactor;
      uniform float uFogIntensity;
      uniform float uFogScale;
      uniform float uWSpeed;
      uniform float uWIntensity;
      uniform float uFlowStrength;
      uniform float uDecay;
      uniform float uFalloffStart;
      uniform float uFogFallSpeed;
      uniform vec3 uColor;
      uniform float uFade;
      
      #define PI 3.14159265359
      #define TWO_PI 6.28318530718
      #define EPS 1e-6
      #define EDGE_SOFT (DT_LOCAL*4.0)
      #define DT_LOCAL 0.0038
      #define TAP_RADIUS 6
      #define R_H 150.0
      #define R_V 150.0
      #define FLARE_HEIGHT 16.0
      #define FLARE_AMOUNT 8.0
      #define FLARE_EXP 2.0
      #define TOP_FADE_START 0.1
      #define TOP_FADE_EXP 1.0
      #define FLOW_PERIOD 0.5
      #define FLOW_SHARPNESS 1.5
      
      #define W_BASE_X 1.5
      #define W_LAYER_GAP 0.25
      #define W_LANES 10
      #define W_SIDE_DECAY 0.5
      #define W_HALF 0.01
      #define W_AA 0.15
      #define W_CELL 20.0
      #define W_SEG_MIN 0.01
      #define W_SEG_MAX 0.55
      #define W_CURVE_AMOUNT 15.0
      #define W_CURVE_RANGE (FLARE_HEIGHT - 3.0)
      #define W_BOTTOM_EXP 10.0
      
      #define FOG_ON 1
      #define FOG_CONTRAST 1.2
      #define FOG_OCTAVES 5
      #define FOG_BOTTOM_BIAS 0.8
      #define FOG_TILT_MAX_X 0.35
      #define FOG_TILT_SHAPE 1.5
      #define FOG_BEAM_MIN 0.0
      #define FOG_BEAM_MAX 0.75
      #define FOG_MASK_GAMMA 0.5
      #define FOG_EXPAND_SHAPE 12.2
      #define FOG_EDGE_MIX 0.5
      
      #define HFOG_EDGE_START 0.20
      #define HFOG_EDGE_END 0.98
      #define HFOG_EDGE_GAMMA 1.4
      #define HFOG_Y_RADIUS 25.0
      #define HFOG_Y_SOFT 60.0
      
      #define EDGE_X0 0.22
      #define EDGE_X1 0.995
      #define EDGE_X_GAMMA 1.25
      #define EDGE_LUMA_T0 0.0
      #define EDGE_LUMA_T1 2.0
      #define DITHER_STRENGTH 1.0

      float g(float x){return x<=0.00031308?12.92*x:1.055*pow(x,1.0/2.4)-0.055;}
      float bs(vec2 p,vec2 q,float powr){
          float d=distance(p,q),f=powr*uFalloffStart,r=(f*f)/(d*d+EPS);
          return powr*min(1.0,r);
      }
      float bsa(vec2 p,vec2 q,float powr,vec2 s){
          vec2 d=p-q; float dd=(d.x*d.x)/(s.x*s.x)+(d.y*d.y)/(s.y*s.y),f=powr*uFalloffStart,r=(f*f)/(dd+EPS);
          return powr*min(1.0,r);
      }
      float tri01(float x){float f=fract(x);return 1.0-abs(f*2.0-1.0);}
      float tauWf(float t,float tmin,float tmax){float a=smoothstep(tmin,tmin+EDGE_SOFT,t),b=1.0-smoothstep(tmax-EDGE_SOFT,tmax,t);return max(0.0,a*b);} 
      float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+34.123);return fract(p.x*p.y);}
      float vnoise(vec2 p){
          vec2 i=floor(p),f=fract(p);
          float a=h21(i),b=h21(i+vec2(1,0)),c=h21(i+vec2(0,1)),d=h21(i+vec2(1,1));
          vec2 u=f*f*(3.0-2.0*f);
          return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
      }
      float fbm2(vec2 p){
          float v=0.0,amp=0.6; mat2 m=mat2(0.86,0.5,-0.5,0.86);
          for(int i=0;i<FOG_OCTAVES;++i){v+=amp*vnoise(p); p=m*p*2.03+17.1; amp*=0.52;}
          return v;
      }
      float rGate(float x,float l){float a=smoothstep(0.0,W_AA,x),b=1.0-smoothstep(l,l+W_AA,x);return max(0.0,a*b);}
      float flareY(float y){float t=clamp(1.0-(clamp(y,0.0,FLARE_HEIGHT)/max(FLARE_HEIGHT,EPS)),0.0,1.0);return pow(t,FLARE_EXP);}

      float vWisps(vec2 uv,float topF){
        float y=uv.y,yf=(y+uFlowTime*uWSpeed)/W_CELL;
        float dRaw=clamp(uWispDensity,0.0,2.0),d=dRaw<=0.0?1.0:dRaw;
        float lanesF=floor(float(W_LANES)*min(d,1.0)+0.5);
        int lanes=int(max(1.0,lanesF));
        float sp=min(d,1.0),ep=max(d-1.0,0.0);
        float fm=flareY(max(y,0.0)),rm=clamp(1.0-(y/max(W_CURVE_RANGE,EPS)),0.0,1.0),cm=fm*rm;
        const float G=0.05; float xS=1.0+(FLARE_AMOUNT*W_CURVE_AMOUNT*G)*cm;
        float sPix=clamp(y/R_V,0.0,1.0),bGain=pow(1.0-sPix,W_BOTTOM_EXP),sum=0.0;
        for(int s=0;s<2;++s){
            float sgn=s==0?-1.0:1.0;
            for(int i=0;i<W_LANES;++i){
                if(i>=lanes) break;
                float off=W_BASE_X+float(i)*W_LAYER_GAP,xc=sgn*(off*xS);
                float dx=abs(uv.x-xc),lat=1.0-smoothstep(W_HALF,W_HALF+W_AA,dx),amp=exp(-off*W_SIDE_DECAY);
                float seed=h21(vec2(off,sgn*17.0)),yf2=yf+seed*7.0,ci=floor(yf2),fy=fract(yf2);
                float seg=mix(W_SEG_MIN,W_SEG_MAX,h21(vec2(ci,off*2.3)));
                float spR=h21(vec2(ci,off+sgn*31.0)),seg1=rGate(fy,seg)*step(spR,sp);
                if(ep>0.0){float spR2=h21(vec2(ci*3.1+7.0,off*5.3+sgn*13.0)); float f2=fract(fy+0.5); seg1+=rGate(f2,seg*0.9)*step(spR2,ep);}
                sum+=amp*lat*seg1;
            }
        }
        float span=smoothstep(-3.0,0.0,y)*(1.0-smoothstep(R_V-6.0,R_V,y));
        return uWIntensity*sum*topF*bGain*span;
      }

      void mainImage(out vec4 fc,in vec2 frag){
          vec2 C = vec2(iResolution.x * 0.5, 0.0); float invW=1.0/max(C.x,1.0);
          float sc=512.0/iResolution.x*.4;
          vec2 uv=(frag-C)*sc,off=vec2(uBeamXFrac*iResolution.x*sc,uBeamYFrac*iResolution.y*sc);
          vec2 uvc = uv - off;
          float a=0.0,b=0.0;
          float basePhase=1.5*PI+uDecay*.5; float tauMin=basePhase-uDecay; float tauMax=basePhase;
          float cx=clamp(uvc.x/(R_H*uHLenFactor),-1.0,1.0),tH=clamp(TWO_PI-acos(cx),tauMin,tauMax);
          for(int k=-TAP_RADIUS;k<=TAP_RADIUS;++k){
              float tu=tH+float(k)*DT_LOCAL,wt=tauWf(tu,tauMin,tauMax); if(wt<=0.0) continue;
              float spd=max(abs(sin(tu)),0.02),u=clamp((basePhase-tu)/max(uDecay,EPS),0.0,1.0),env=pow(1.0-abs(u*2.0-1.0),0.8);
              vec2 p=vec2((R_H*uHLenFactor)*cos(tu),0.0);
              a+=wt*bs(uvc,p,env*spd);
          }
          float yPix=uvc.y,cy=clamp(-yPix/(R_V*uVLenFactor),-1.0,1.0),tV=clamp(TWO_PI-acos(cy),tauMin,tauMax);
          for(int k=-TAP_RADIUS;k<=TAP_RADIUS;++k){
              float tu=tV+float(k)*DT_LOCAL,wt=tauWf(tu,tauMin,tauMax); if(wt<=0.0) continue;
              float yb=(-R_V)*cos(tu),s=clamp(yb/R_V,0.0,1.0),spd=max(abs(sin(tu)),0.02);
              float env=pow(1.0-s,0.6)*spd;
              float cap=1.0-smoothstep(TOP_FADE_START,1.0,s); cap=pow(cap,TOP_FADE_EXP); env*=cap;
              float ph=s/max(FLOW_PERIOD,EPS)+uFlowTime*uFlowSpeed;
              float fl=pow(tri01(ph),FLOW_SHARPNESS);
              env*=mix(1.0-uFlowStrength,1.0,fl);
              float yp=(-R_V*uVLenFactor)*cos(tu),m=pow(smoothstep(FLARE_HEIGHT,0.0,yp),FLARE_EXP),wx=1.0+FLARE_AMOUNT*m;
              vec2 sig=vec2(wx,1.0),p=vec2(0.0,yp);
              float mask=step(0.0,yp);
              b+=wt*bsa(uvc,p,mask*env,sig);
          }
          float sPix=clamp(yPix/R_V,0.0,1.0),topA=pow(1.0-smoothstep(TOP_FADE_START,1.0,sPix),TOP_FADE_EXP);
          float L=a+b*topA;
          float w=vWisps(vec2(uvc.x,yPix),topA);
          float fog=0.0;

          #if FOG_ON
              vec2 fuv=uvc*uFogScale;
              float mAct=step(1.0,length(iMouse.xy)),nx=((iMouse.x-C.x)*invW)*mAct;
              float ax = abs(nx);
              float stMag = mix(ax, pow(ax, FOG_TILT_SHAPE), 0.35);
              float st = sign(nx) * stMag * uTiltScale;
              st = clamp(st, -FOG_TILT_MAX_X, FOG_TILT_MAX_X);
              vec2 dir=normalize(vec2(st,1.0));
              fuv+=uFogTime*uFogFallSpeed*dir;
              vec2 prp=vec2(-dir.y,dir.x);
              fuv+=prp*(0.08*sin(dot(uvc,prp)*0.08+uFogTime*0.9));
              float n=fbm2(fuv+vec2(fbm2(fuv+vec2(7.3,2.1)),fbm2(fuv+vec2(-3.7,5.9)))*0.6);
              n=pow(clamp(n,0.0,1.0),FOG_CONTRAST);
              float pixW = 1.0 / max(iResolution.y, 1.0);
              
              #ifdef GL_OES_standard_derivatives
                  float wL = max(fwidth(L), pixW);
              #else
                  float wL = pixW;
              #endif
              
              float m0=pow(smoothstep(FOG_BEAM_MIN - wL, FOG_BEAM_MAX + wL, L),FOG_MASK_GAMMA);
              float bm=1.0-pow(1.0-m0,FOG_EXPAND_SHAPE); bm=mix(bm*m0,bm,FOG_EDGE_MIX);
              float yP=1.0-smoothstep(HFOG_Y_RADIUS,HFOG_Y_RADIUS+HFOG_Y_SOFT,abs(yPix));
              float nxF=abs((frag.x-C.x)*invW),hE=1.0-smoothstep(HFOG_EDGE_START,HFOG_EDGE_END,nxF); hE=pow(clamp(hE,0.0,1.0),HFOG_EDGE_GAMMA);
              float hW=mix(1.0,hE,clamp(yP,0.0,1.0));
              float bBias=mix(1.0,1.0-sPix,FOG_BOTTOM_BIAS);
              float browserFogIntensity = uFogIntensity * 1.8;
              float radialFade = 1.0 - smoothstep(0.0, 0.7, length(uvc) / 120.0);
              float safariFog = n * browserFogIntensity * bBias * bm * hW * radialFade;
              fog = safariFog;
          #endif

          float LF=L+fog;
          float dith=(h21(frag)-0.5)*(DITHER_STRENGTH/255.0);
          float tone=g(LF+w);
          vec3 col=tone*uColor+dith;
          float alpha=clamp(g(L+w*0.6)+dith*0.6,0.0,1.0);
          float nxE=abs((frag.x-C.x)*invW),xF=pow(clamp(1.0-smoothstep(EDGE_X0,EDGE_X1,nxE),0.0,1.0),EDGE_X_GAMMA);
          float scene=LF+max(0.0,w)*0.5,hi=smoothstep(EDGE_LUMA_T0,EDGE_LUMA_T1,scene);
          float eM=mix(xF,1.0,hi);
          col*=eM; alpha*=eM;
          col*=uFade; alpha*=uFade;
          
          fc=vec4(col,alpha);
      }

      void main(){
        vec4 fc;
        mainImage(fc, gl_FragCoord.xy);
        gl_FragColor = fc;
      }
    `;

    function hexToRGB(hexStr: string) {
      let c = (hexStr || '').trim();
      if (c[0] === '#') c = c.slice(1);
      if (c.length === 3) c = c.split('').map((x) => x + x).join('');
      const n = parseInt(c, 16);
      const val = Number.isNaN(n) ? 0xc379ff : n;
      return [((val >> 16) & 255) / 255, ((val >> 8) & 255) / 255, (val & 255) / 255];
    }

    function compileShader(type: number, src: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(shader));
      }
      return shader;
    }

    const vertShader = compileShader(gl.VERTEX_SHADER, vertSrc);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, fragSrc);

    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Single triangle covering clipping space [-1, -1] to [3, 3]
    const positions = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 3, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uLocations = {
      iTime: gl.getUniformLocation(program, 'iTime'),
      iResolution: gl.getUniformLocation(program, 'iResolution'),
      iMouse: gl.getUniformLocation(program, 'iMouse'),
      uWispDensity: gl.getUniformLocation(program, 'uWispDensity'),
      uTiltScale: gl.getUniformLocation(program, 'uTiltScale'),
      uFlowTime: gl.getUniformLocation(program, 'uFlowTime'),
      uFogTime: gl.getUniformLocation(program, 'uFogTime'),
      uBeamXFrac: gl.getUniformLocation(program, 'uBeamXFrac'),
      uBeamYFrac: gl.getUniformLocation(program, 'uBeamYFrac'),
      uFlowSpeed: gl.getUniformLocation(program, 'uFlowSpeed'),
      uVLenFactor: gl.getUniformLocation(program, 'uVLenFactor'),
      uHLenFactor: gl.getUniformLocation(program, 'uHLenFactor'),
      uFogIntensity: gl.getUniformLocation(program, 'uFogIntensity'),
      uFogScale: gl.getUniformLocation(program, 'uFogScale'),
      uWSpeed: gl.getUniformLocation(program, 'uWSpeed'),
      uWIntensity: gl.getUniformLocation(program, 'uWIntensity'),
      uFlowStrength: gl.getUniformLocation(program, 'uFlowStrength'),
      uDecay: gl.getUniformLocation(program, 'uDecay'),
      uFalloffStart: gl.getUniformLocation(program, 'uFalloffStart'),
      uFogFallSpeed: gl.getUniformLocation(program, 'uFogFallSpeed'),
      uColor: gl.getUniformLocation(program, 'uColor'),
      uFade: gl.getUniformLocation(program, 'uFade'),
    };

    const rgb = hexToRGB(color);

    // Set static uniforms
    gl.uniform1f(uLocations.uWispDensity, 1.0);
    gl.uniform1f(uLocations.uTiltScale, 0.01);
    gl.uniform1f(uLocations.uBeamXFrac, 0.0);
    gl.uniform1f(uLocations.uBeamYFrac, 0.0);
    gl.uniform1f(uLocations.uFlowSpeed, 0.35);
    gl.uniform1f(uLocations.uVLenFactor, 2.0);
    gl.uniform1f(uLocations.uHLenFactor, 0.5);
    gl.uniform1f(uLocations.uFogIntensity, 0.45);
    gl.uniform1f(uLocations.uFogScale, 0.3);
    gl.uniform1f(uLocations.uWSpeed, 15.0);
    gl.uniform1f(uLocations.uWIntensity, 5.0);
    gl.uniform1f(uLocations.uFlowStrength, 0.25);
    gl.uniform1f(uLocations.uDecay, 1.1);
    gl.uniform1f(uLocations.uFalloffStart, 1.2);
    gl.uniform1f(uLocations.uFogFallSpeed, 0.6);
    gl.uniform3f(uLocations.uColor, rgb[0], rgb[1], rgb[2]);
    gl.uniform1f(uLocations.uFade, 1.0);

    let mouseX = 0;
    let mouseY = 0;
    let currMouseX = 0;
    let currMouseY = 0;

    const parent = canvas.parentElement;

    const handleMouseMove = (e: MouseEvent) => {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      mouseX = x * dpr;
      mouseY = (rect.height - y) * dpr;
    };

    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
    }

    let animId: number;
    let startTime = performance.now();
    let flowTime = 0;
    let fogTime = 0;
    let prevTime = performance.now();

    const resize = () => {
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform3f(uLocations.iResolution, w * dpr, h * dpr, dpr);
    };

    const resizeObserver = new ResizeObserver(() => resize());
    if (parent) {
      resizeObserver.observe(parent);
    }
    resize();

    const render = (now: number) => {
      const dt = Math.max(0, (now - prevTime) / 1000);
      prevTime = now;
      const cdt = Math.min(0.033, Math.max(0.001, dt));

      flowTime += cdt;
      fogTime += cdt;

      currMouseX += (mouseX - currMouseX) * 0.05;
      currMouseY += (mouseY - currMouseY) * 0.05;

      const t = (now - startTime) / 1000;

      gl.uniform1f(uLocations.iTime, t);
      gl.uniform1f(uLocations.uFlowTime, flowTime);
      gl.uniform1f(uLocations.uFogTime, fogTime);
      gl.uniform4f(uLocations.iMouse, currMouseX, currMouseY, 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
      }
      resizeObserver.disconnect();
    };
  }, [color]);

  return <canvas ref={canvasRef} className={className} />;
};
