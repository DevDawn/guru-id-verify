import { Mail, Github, Linkedin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#052880] text-white py-6 text-center">
            <div className="flex justify-center space-x-6 mb-4">
                <a href="mailto:guruihub@gmail.com" className="hover:text-gray-300">
                    <Mail size={24} />
                </a>
                <a href="https://github.com/GuruInnovationHub" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                    <Github size={24} />
                </a>
                <a href="https://www.linkedin.com/company/guru-i-hub/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                    <Linkedin size={24} />
                </a>
            </div>
            <p className="text-sm">© 2025 Guru Innovation Hub. All rights reserved.</p>
            <p className="text-xs mt-2">Powered by <span className="font-semibold">Guru Innovation Hub Devs</span></p>
        </footer>
    );
};

export default Footer;
