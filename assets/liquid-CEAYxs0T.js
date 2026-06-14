import{a as e,c as t,d as n,f as r,g as i,h as a,i as o,l as s,n as c,o as l,p as u,r as d,s as f,t as p,u as m}from"./three.module-DTwpF38d.js";var h={mouseForce:17,cursorSize:80,isViscous:!0,viscous:20,iterationsViscous:24,iterationsPoisson:28,dt:.014,BFECC:!0,resolution:.5,isBounce:!1,colors:[`#598fe9`,`#74aed5`,`#96cfff`],autoDemo:!0,autoSpeed:.4,autoIntensity:1.5,takeoverDuration:.25,autoResumeDelay:3e3,autoRampDuration:.6},g=document.querySelector(`#liquidEther`),_=class{constructor(e){this.container=e,this.coords=new a(0,0),this.coordsOld=new a(0,0),this.diff=new a(0,0),this.hover=!1,this.user=!1,this.auto=!1,this.takeover=!1,this.takeoverStart=0,this.takeoverFrom=new a,this.takeoverTo=new a,this.timer=null}setClient(e,t){let n=this.container.getBoundingClientRect(),r=(e-n.left)/Math.max(1,n.width),i=(t-n.top)/Math.max(1,n.height);this.coords.set(r*2-1,-(i*2-1)),this.timer&&window.clearTimeout(this.timer),this.timer=window.setTimeout(()=>{this.diff.set(0,0)},100)}move(e){let t=this.container.getBoundingClientRect();if(!(e.clientX>=t.left&&e.clientX<=t.right&&e.clientY>=t.top&&e.clientY<=t.bottom))return!1;if(this.hover=!0,this.auto&&!this.user&&!this.takeover){let n=(e.clientX-t.left)/Math.max(1,t.width),r=(e.clientY-t.top)/Math.max(1,t.height);return this.takeoverFrom.copy(this.coords),this.takeoverTo.set(n*2-1,-(r*2-1)),this.takeoverStart=performance.now(),this.takeover=!0,this.user=!0,this.auto=!1,!0}return this.setClient(e.clientX,e.clientY),this.user=!0,!0}update(e){if(this.takeover){let t=(e-this.takeoverStart)/(h.takeoverDuration*1e3);if(t>=1)this.takeover=!1,this.coords.copy(this.takeoverTo),this.coordsOld.copy(this.coords),this.diff.set(0,0);else{let e=t*t*(3-2*t);this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo,e)}}this.diff.subVectors(this.coords,this.coordsOld),this.coordsOld.copy(this.coords),this.auto&&!this.takeover&&this.diff.multiplyScalar(h.autoIntensity)}},v=class{constructor(e){this.mouse=e,this.active=!1,this.current=new a,this.target=new a,this.lastTime=performance.now(),this.activationTime=0,this.margin=.2,this.pick()}pick(){this.target.set((Math.random()*2-1)*(1-this.margin),(Math.random()*2-1)*(1-this.margin))}stop(){this.active=!1,this.mouse.auto=!1}update(e,t){if(!h.autoDemo)return;if(e-t<h.autoResumeDelay||this.mouse.hover){this.active&&this.stop();return}this.active||(this.active=!0,this.current.copy(this.mouse.coords),this.lastTime=e,this.activationTime=e),this.mouse.auto=!0;let n=(e-this.lastTime)/1e3;this.lastTime=e,n>.2&&(n=.016);let r=this.target.clone().sub(this.current),i=r.length();if(i<.01){this.pick();return}r.normalize();let a=Math.min(1,(e-this.activationTime)/(h.autoRampDuration*1e3)),o=a*a*(3-2*a);this.current.addScaledVector(r,Math.min(h.autoSpeed*n*o,i)),this.mouse.coords.copy(this.current)}};new class{constructor(t){this.canvas=t,this.renderer=new p({canvas:t,alpha:!0,antialias:!0}),this.renderer.autoClear=!1,this.renderer.setClearColor(new e(0),0),this.clock=new o,this.mouse=new _(t),this.auto=new v(this.mouse),this.lastUserInteraction=performance.now(),this.scene=new u,this.camera=new c,this.quad=new n(2,2),this.palette=h.colors.map(t=>new e(t)),this.initPasses(),this.resize(),this.bind(),this.clock.start(),this.loop()}bind(){window.addEventListener(`resize`,()=>this.resize()),window.addEventListener(`mousemove`,e=>{this.mouse.move(e)&&(this.lastUserInteraction=performance.now(),this.auto.stop())}),document.addEventListener(`mouseleave`,()=>{this.mouse.hover=!1,this.mouse.user=!1})}target(){let e={type:/(iPad|iPhone|iPod)/i.test(navigator.userAgent)?f:l,minFilter:t,magFilter:t,wrapS:d,wrapT:d,depthBuffer:!1,stencilBuffer:!1};return new i(this.fboWidth,this.fboHeight,e)}material(e,t){return new r({vertexShader:`
              precision highp float;
              attribute vec3 position;
              varying vec2 uv;
              void main() {
                uv = position.xy * 0.5 + 0.5;
                gl_Position = vec4(position.xy, 0.0, 1.0);
              }
            `,fragmentShader:e,uniforms:t})}mesh(e){let t=new u;return t.add(new m(this.quad,e)),{scene:t,material:e}}initPasses(){this.advection=this.mesh(this.material(`
            precision highp float;
            uniform sampler2D velocity;
            uniform float dt;
            uniform bool isBFECC;
            uniform vec2 fboSize;
            varying vec2 uv;
            void main() {
              vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
              if (!isBFECC) {
                vec2 vel = texture2D(velocity, uv).xy;
                gl_FragColor = vec4(texture2D(velocity, uv - vel * dt * ratio).xy * 0.992, 0.0, 1.0);
              } else {
                vec2 spot_new = uv;
                vec2 vel_old = texture2D(velocity, uv).xy;
                vec2 spot_old = spot_new - vel_old * dt * ratio;
                vec2 vel_new1 = texture2D(velocity, spot_old).xy;
                vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
                vec2 error = spot_new2 - spot_new;
                vec2 spot_new3 = spot_new - error / 2.0;
                vec2 vel_2 = texture2D(velocity, spot_new3).xy;
                vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
                gl_FragColor = vec4(texture2D(velocity, spot_old2).xy * 0.992, 0.0, 1.0);
              }
            }
          `,{velocity:{value:null},dt:{value:h.dt},isBFECC:{value:h.BFECC},fboSize:{value:new a}})),this.force=this.mesh(this.material(`
            precision highp float;
            uniform sampler2D velocity;
            uniform vec2 force;
            uniform vec2 center;
            uniform vec2 scale;
            varying vec2 uv;
            void main() {
              vec2 vel = texture2D(velocity, uv).xy;
              vec2 circle = (uv - center) / scale;
              float d = 1.0 - min(length(circle), 1.0);
              d *= d;
              gl_FragColor = vec4(vel + force * d, 0.0, 1.0);
            }
          `,{velocity:{value:null},force:{value:new a},center:{value:new a},scale:{value:new a}})),this.viscous=this.mesh(this.material(`
            precision highp float;
            uniform sampler2D velocity;
            uniform sampler2D velocity_new;
            uniform float v;
            uniform vec2 px;
            uniform float dt;
            varying vec2 uv;
            void main() {
              vec2 old = texture2D(velocity, uv).xy;
              vec2 n0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
              vec2 n1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
              vec2 n2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
              vec2 n3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
              vec2 next = 4.0 * old + v * dt * (n0 + n1 + n2 + n3);
              next /= 4.0 * (1.0 + v * dt);
              gl_FragColor = vec4(next, 0.0, 1.0);
            }
          `,{velocity:{value:null},velocity_new:{value:null},v:{value:h.viscous},px:{value:new a},dt:{value:h.dt}})),this.divergence=this.mesh(this.material(`
            precision highp float;
            uniform sampler2D velocity;
            uniform vec2 px;
            uniform float dt;
            varying vec2 uv;
            void main() {
              float x0 = texture2D(velocity, uv - vec2(px.x, 0.0)).x;
              float x1 = texture2D(velocity, uv + vec2(px.x, 0.0)).x;
              float y0 = texture2D(velocity, uv - vec2(0.0, px.y)).y;
              float y1 = texture2D(velocity, uv + vec2(0.0, px.y)).y;
              gl_FragColor = vec4(((x1 - x0 + y1 - y0) / 2.0) / dt, 0.0, 0.0, 1.0);
            }
          `,{velocity:{value:null},px:{value:new a},dt:{value:h.dt}})),this.poisson=this.mesh(this.material(`
            precision highp float;
            uniform sampler2D pressure;
            uniform sampler2D divergence;
            uniform vec2 px;
            varying vec2 uv;
            void main() {
              float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
              float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
              float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
              float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
              float div = texture2D(divergence, uv).r;
              gl_FragColor = vec4((p0 + p1 + p2 + p3) / 4.0 - div, 0.0, 0.0, 1.0);
            }
          `,{pressure:{value:null},divergence:{value:null},px:{value:new a}})),this.pressure=this.mesh(this.material(`
            precision highp float;
            uniform sampler2D pressure;
            uniform sampler2D velocity;
            uniform vec2 px;
            uniform float dt;
            varying vec2 uv;
            void main() {
              float p0 = texture2D(pressure, uv + vec2(px.x, 0.0)).r;
              float p1 = texture2D(pressure, uv - vec2(px.x, 0.0)).r;
              float p2 = texture2D(pressure, uv + vec2(0.0, px.y)).r;
              float p3 = texture2D(pressure, uv - vec2(0.0, px.y)).r;
              vec2 v = texture2D(velocity, uv).xy;
              vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
              gl_FragColor = vec4(v - gradP * dt, 0.0, 1.0);
            }
          `,{pressure:{value:null},velocity:{value:null},px:{value:new a},dt:{value:h.dt}})),this.output=this.mesh(this.material(`
            precision highp float;
            uniform sampler2D velocity;
            uniform vec3 color0;
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 uv;
            void main() {
              vec2 vel = texture2D(velocity, uv).xy;
              float lenv = clamp(length(vel) * 1.8, 0.0, 1.0);
              vec3 c = mix(color0, color1, smoothstep(0.05, 0.52, lenv));
              c = mix(c, color2, smoothstep(0.42, 1.0, lenv));
              float a = smoothstep(0.012, 0.88, lenv) * 0.82;
              gl_FragColor = vec4(c, a);
            }
          `,{velocity:{value:null},color0:{value:this.palette[0]},color1:{value:this.palette[1]},color2:{value:this.palette[2]}}))}resize(){let e=Math.min(window.devicePixelRatio||1,2),t=Math.max(1,Math.floor(window.innerWidth)),n=Math.max(1,Math.floor(window.innerHeight));this.renderer.setPixelRatio(e),this.renderer.setSize(t,n,!1),this.fboWidth=Math.max(2,Math.round(t*h.resolution)),this.fboHeight=Math.max(2,Math.round(n*h.resolution)),this.px=new a(1/this.fboWidth,1/this.fboHeight),this.fboSize=new a(this.fboWidth,this.fboHeight),this.vel0=this.target(),this.vel1=this.target(),this.visc0=this.target(),this.visc1=this.target(),this.div=this.target(),this.pressure0=this.target(),this.pressure1=this.target()}renderPass(e,t){this.renderer.setRenderTarget(t),this.renderer.render(e.scene,this.camera),this.renderer.setRenderTarget(null)}simulate(){this.advection.material.uniforms.velocity.value=this.vel0.texture,this.advection.material.uniforms.fboSize.value.copy(this.fboSize),this.renderPass(this.advection,this.vel1);let e=h.cursorSize/this.fboWidth,t=h.cursorSize/this.fboHeight;this.force.material.uniforms.velocity.value=this.vel1.texture,this.force.material.uniforms.force.value.set(this.mouse.diff.x/2*h.mouseForce,this.mouse.diff.y/2*h.mouseForce),this.force.material.uniforms.center.value.set(s.clamp(this.mouse.coords.x*.5+.5,e+this.px.x*2,1-e-this.px.x*2),s.clamp(this.mouse.coords.y*.5+.5,t+this.px.y*2,1-t-this.px.y*2)),this.force.material.uniforms.scale.value.set(e,t),this.renderPass(this.force,this.vel0);let n=this.vel0;if(h.isViscous){for(let e=0;e<h.iterationsViscous;e+=1)this.viscous.material.uniforms.velocity.value=n.texture,this.viscous.material.uniforms.velocity_new.value=(e%2==0?this.visc0:this.visc1).texture,this.viscous.material.uniforms.px.value.copy(this.px),this.renderPass(this.viscous,e%2==0?this.visc1:this.visc0);n=h.iterationsViscous%2==0?this.visc0:this.visc1}this.divergence.material.uniforms.velocity.value=n.texture,this.divergence.material.uniforms.px.value.copy(this.px),this.renderPass(this.divergence,this.div);for(let e=0;e<h.iterationsPoisson;e+=1)this.poisson.material.uniforms.pressure.value=(e%2==0?this.pressure0:this.pressure1).texture,this.poisson.material.uniforms.divergence.value=this.div.texture,this.poisson.material.uniforms.px.value.copy(this.px),this.renderPass(this.poisson,e%2==0?this.pressure1:this.pressure0);this.pressure.material.uniforms.pressure.value=(h.iterationsPoisson%2==0?this.pressure0:this.pressure1).texture,this.pressure.material.uniforms.velocity.value=n.texture,this.pressure.material.uniforms.px.value.copy(this.px),this.renderPass(this.pressure,this.vel1),[this.vel0,this.vel1]=[this.vel1,this.vel0]}loop(){let e=performance.now();this.auto.update(e,this.lastUserInteraction),this.mouse.update(e),this.simulate(),this.renderer.setRenderTarget(null),this.output.material.uniforms.velocity.value=this.vel0.texture,this.renderer.render(this.output.scene,this.camera),requestAnimationFrame(()=>this.loop())}}(g);