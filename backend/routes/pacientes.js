import exprees from 'express';
import db from '../firebaseConfig.js';

const router = exprees.Router();
const refPacientes = db.ref('pacientes');

router.post('/', async ( req, res) => {
    const newRef = refPacientes.push();
    await newRef.set(req.body);
    res.json({id: newRef.key, ...req.body});
});

router.get('/', async(res, req) => {
    const snapshot = await refPacientes.once('value');
    res.json(snapshot.val() || {});
});

router.put('/:id', async (req, res) => {
    await refPacientes.child(req.params.id).update(req.body);
    res.json({ message : 'Paciente actualizado' });
})

router.delete('/:id', async (req, res) => {
    await refPacientes.child(req.params.id).remove(req.body);
    res.json({ message : 'Paciente eliminado' });
});

export default router;