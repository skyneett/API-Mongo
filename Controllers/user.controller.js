const User = require('../Models/user.model');

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const createUser = async (req, res) => {
    const {name, email} = req.body;
    try {
        const newUser = new User({name, email});
        await newUser.save();
        res.status(201).json(newUser);
    }catch (error) {
        res.status(400).json({message: error.message});
    }
};

const updateUser = async (req, res) => {
    const {id} = req.params;
    const {name, email} = req.body;
    try {
        const updateUser = await User.findByIdAndUpdate(
            id,
            {name, email},
            {new: true}
        );
        if (!updateUser) {
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        res.json(updateUser);
    }catch (error) {
        res.status(400).json({message: error.message});
    }
};

const deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser) {
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        res.json({message: "Usuario eliminado correctamente"});
    }catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};