import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import path from "path";
import { fileURLToPath } from "url";


const router = Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'login.html'));
});

router.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'homepage.html'));
});

router.get('/', (req, res) => {
    res.redirect('/login');
});

export default router;