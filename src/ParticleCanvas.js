import React, { useEffect, useRef, useState } from 'react';
import './ParticleCanvas.css';
import explosionSound from './sounds/explosion.mp3';
import captchaImage from './img/captcha.jpg'; // 导入您的验证码图片
import smileImage from './img/smile.jpg';
import screamerImage from './img/KOSTya2.gif';
const ParticleCanvas = () => {
  const Modal = ({ imageSrc, altText }) => {
    return (
      <div
        className="modalContent"
        style={{
          width: "100%",
          height: "100vh",
          display: display,
          zIndex: 1
        }}
      >
        <img
          src={imageSrc}
          alt={altText}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  };

  const [showModal, setShowModal] = useState(true);
  const [captchaValue, setCaptchaValue] = useState('');
  const [radioButtonText, setRadioButtonText] = useState('Нет');
  const [modalDisplay, setModalDisplay] = useState('block');
  const [isRadioButtonSelected, setIsRadioButtonSelected] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [display, setDisplay] = useState('none');
  const [altText, setAltText] = useState('');

  const openModalWithContent = (content) => {
    setImageSrc(content);
    setDisplay("block");
    setModalDisplay("none");
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
    }, 3000); 
  };

  const handleCaptchaChange = (event) => {
    setCaptchaValue(event.target.value);
  };

  const handleRadioButtonChange = (event) => {
    setIsRadioButtonSelected(true);
  };

  const handleSubmit = () => {
    if (isRadioButtonSelected) {
      openModalWithContent(smileImage);
    } else {
      openModalWithContent(screamerImage);
    }
    setIsRadioButtonSelected(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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
      particles.current.forEach(async (part) => {
        if (part.isExploding) {
          part.explosionTick++;
          if (part.explosionTick > 10) {
            const explosionAudio = new Audio(explosionSound);
            explosionAudio.volume = 0.01;
            explosionAudio.play();

            const explosionElement = document.createElement('div');
            explosionElement.classList.add('explosion');
            explosionElement.style.left = part.x + 'px';
            explosionElement.style.top = part.y + 'px';
            explosionElement.classList.add('explosion-active');
            let container = document.querySelector('.container');
            if (!container) {
              container = document.createElement('div');
              container.classList.add('container');
              document.body.appendChild(container);
            }

            container.appendChild(explosionElement);

            particles.current.splice(particles.current.indexOf(part), 1);
            setTimeout(() => {
              explosionElement.remove();
            }, 2000);
          }
          return;
        }

        part.y += part.speed;
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
      if (event.button === 0) {
        mousePos.current = { x: event.clientX, y: event.clientY };
        particles.current.forEach((part) => {
          const distance = Math.sqrt(
            (part.x - mousePos.current.x) ** 2 +
            (part.y - mousePos.current.y) ** 2
          );
          if (distance < 50) {
            part.isExploding = true;
          }
        });
      }
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
    };
  }, []);

  return (
    <div>
      {showModal && (
        <>
          <Modal imageSrc={imageSrc} altText={altText} style={{
              display: 'none',
              zIndex: 1,
            }}/>
          <div
            className="modal"
            style={{
                display: modalDisplay,
                zIndex: 1,
              }}
          >
            {captchaValue.toLowerCase() !== 'капча' ? (
              <>
                <h2>Введите капчу</h2>
                <div>
                  <img
                    src={captchaImage}
                    alt="Капча"
                    width="100%"
                    height="90vh"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={captchaValue}
                    onChange={handleCaptchaChange}
                    placeholder="Введите капчу"
                  />
                </div>
                <div></div>
              </>
            ) : (
              <>
                <h2>Ты пидор?</h2>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="captchaOption"
                      value="Да"
                      onChange={handleRadioButtonChange}
                    />
                    Да
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="captchaOption"
                      value="Да"
                      onChange={handleRadioButtonChange}
                    />
                    Да
                  </label>
                </div>
                <div>
                  <button
                    onClick={handleSubmit}
                    style={{ width: '100%' }}
                  >
                    Подтвердить
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100vh',
          pointerEvents: showModal ? 'none' : 'auto',
        }}
      />
    </div>
  );
};

export default ParticleCanvas;