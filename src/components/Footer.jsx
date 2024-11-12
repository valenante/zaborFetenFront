import React from 'react';
import { FaFacebook, FaInstagram, FaGoogle, FaTripadvisor } from 'react-icons/fa';
import '../styles/Footer.css'; // Asegúrate de tener este archivo CSS

const Footer = () => {
    return (
        <footer className="footer mt-2">
            <p className='text-purple'>Contacto: <a href="mailto:zaborfeten@gmail.com" className="text-decoration-none text-black">zaborfeten@gmail.com</a> | <a href="tel:665925413" className="text-decoration-none text-black">665 92 54 13</a> y <a href="tel:622024285" className="text-decoration-none text-black">622 024 285</a></p>
            <div className="social-icons">
                <FaFacebook />
                <FaInstagram />
                <FaGoogle />
                <FaTripadvisor />
            </div>
            <p className='text-purple'>&copy;2020 por Zabor Fetén.</p>
        </footer>
    );
};

export default Footer;
