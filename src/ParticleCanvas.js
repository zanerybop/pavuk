import React, { useEffect,useRef } from 'react';
import explosionSound from './sounds/explosion.mp3';
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let tick = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      if (particles.current.length < 200) {
        const newParticle = {
          x: Math.random() * canvas.width,
          y: 0,
          speed: 1 + Math.random(),
          radius: 7 + Math.random() * 7,
          color: '#e8dfdb',
          isExploding: false,
          explosionTick: 0,
        };
        particles.current.push(newParticle);
      }
    };

    const updateParticles = () => {
      particles.current.forEach((part) => {
        if (part.isExploding) {
          part.explosionTick++;
          if (part.explosionTick > 10) {
            const explosionAudio = new Audio(explosionSound);
            explosionAudio.play();
            particles.current.splice(particles.current.indexOf(part), 1);
          }
          return;
        }

        part.y += part.speed;

        const distance = Math.sqrt(
          (part.x - mousePos.current.x) ** 2 + (part.y - mousePos.current.y) ** 2
        );
        if (distance < 50) {
          part.isExploding = true;
        }
      });
    };

    const drawParticles = () => {
      context.fillStyle = '#3b2920';
      context.fillRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((part) => {
        context.beginPath();
        context.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = part.color;
        context.fill();
      });
    };

    const killParticles = () => {
      particles.current.forEach((part) => {
        if (part.y > canvas.height) {
          part.y = 0;
        }
      });
    };

    const handleMouseClick = (event) => {
      mousePos.current = { x: event.clientX, y: event.clientY };
    };

    const loop = () => {
      requestAnimationFrame(loop);
      createParticles();
      updateParticles();
      drawParticles();
      killParticles();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('click', handleMouseClick);

    loop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleMouseClick);
      cancelAnimationFrame(loop);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100vh' }} />;
};

export default ParticleCanvas;