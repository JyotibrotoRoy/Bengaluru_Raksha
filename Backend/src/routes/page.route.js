import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import path from "path";

const router = Router()

router.get('/login', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'login.html'));
}); 

router.get('/homepage', verifyJWT, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'homepage.html'))
})

router.get('/', (req, res) => {
    res.redirect('/login');
});

export default router;