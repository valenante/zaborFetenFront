// Home.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFacebook, FaInstagram, FaGoogle, FaTripadvisor } from 'react-icons/fa';
import '../styles/Home.css';
import logo from '../assets/Manu y Mirian Caricatura.webp';
import bodega from '../assets/bodega.webp';
import Navbar from './Navbar';

const Home = () => {
    return (
        <div>

            <Navbar showCategorySelect={false} showCart={false} />

            {/* Welcome Section */}
            <section className="text-center background-section">
                <h1>Bienvenido a Zabor Fetén</h1>
                <p>Vive una Experiencia Fetén</p>
            </section>

            <section className="about-us-section">
                <img src={logo} alt="Logo Zabor Fetén" className="mb-3" style={{ maxWidth: '150px', borderRadius: '100%' }} /> {/* Logo */}
                <h3>Nuestra Historia</h3>
                <div className="texto">
                    <p>
                        Zabor Fetén nace como fruto de un sueño de una joven pareja, crear un gastrobar donde no solo se va a comer comida española de calidad,
                        sino que se va por una experiencia familiar, alegre y sobre todo de buen rollo.
                    </p>
                    <p>
                        Un proyecto que embellece el centro de Torremolinos, ofreciendo una propuesta fresca, joven e innovadora, compaginado con un equipo de trabajo
                        que siente ser parte de una familia, y que ve como objetivo número uno hacer vivir una experiencia inolvidable a sus clientes.
                    </p>
                </div>
            </section>

            {/* Opening Hours Section */}
            <section className="container my-5">
                <div className="row opening-hours-row">
                    <div className="col-md-6 opening-hours-text d-flex flex-column justify-content-center align-items-center">
                        <h2 className="text-center mb-4">Horarios de Apertura</h2>
                        <p className="text-center text-purple">Cena en Zabor Fetén o llama para recoger y comer en casa.</p>
                        <p className="text-center text-purple">Martes - Domingo: 13:00 - 17:00 h y 20:00 - 24:00</p>
                    </div>
                    <div className="col-md-6 opening-hours-text d-flex flex-column justify-content-center align-items-center">
                        <img
                            src={bodega} // Usa la variable importada
                            alt="Bodega"
                            className="img-fluid rounded" // Clase Bootstrap para borde redondeado
                        />
                    </div>
                </div>
            </section>


            {/* Columna del formulario de contacto */}
            <section className="contact">
                <div className="row">
                    {/* Columna de datos de contacto */}
                    <div className="col-md-6 contact-info d-flex flex-column justify-content-center">
                        <h2 className='mb-3'>Contacto</h2>
                        <p className='text-purple'>Calle de la Cruz, 10, 29620 Torremolinos, Málaga, Spain</p>

                        {/* Fila para Email y Teléfono */}
                        <div className="row mb-3">
                            <div className="col-6">
                                <p className="text-purple">Email: <a href="mailto:zaborfeten@gmail.com" className="text-decoration-none text-black">zaborfeten@gmail.com</a></p>
                            </div>
                            <div className="col-6">
                                <p className='text-purple'>Tel: <a href="tel:665925413" className="text-decoration-none text-black">665 92 54 13</a> y <a href="tel:622024285" className="text-decoration-none text-black">622 024 285</a></p>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mb-3">
                            <FaGoogle />
                            <FaFacebook />
                            <FaInstagram />
                            <FaTripadvisor />
                        </div>
                    </div>

                    {/* Columna del formulario de contacto */}
                    <div className="col-md-6">
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Dirección</label>
                                <input type="text" className="form-control" />
                            </div>

                            {/* Fila para Email y Teléfono en el formulario */}
                            <div className="row mb-3">
                                <div className="col-6">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" />
                                </div>
                                <div className="col-6">
                                    <label className="form-label">Teléfono</label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Asunto</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Escribe tu mensaje aquí...</label>
                                <textarea className="form-control" rows="4"></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Enviar</button>
                        </form>
                    </div>
                </div>
            </section>

            <div className="row">
                <div className="col-12">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12487.664617085075!2d-3.5839425722041466!3d36.62141807083992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7ee164a6e68d17%3A0x77c4d75e4d9aaef8!2sCalle%20de%20la%20Cruz%2C%2010%2C%2029620%20Torremolinos%2C%20M%C3%A1laga%2C%20Spain!5e0!3m2!1ses!2sus!4v1698204532017!5m2!1ses!2sus"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        title="Ubicación de Zabor Fetén"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Home;
