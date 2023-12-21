const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../../../models/user.js')
const Response = require('../../../utils/helpers/response.js')

module.exports = async (req, res) => {
    try {
        if(!req.body) return res.status(400).json(new Response(400, 'Mauvaise requête vérifiez les données.'))
        const { nom, prenom, email, password } = req.body

        if (!nom || !prenom || !email || !password || password.length < 6) {
            return res.status(400).json(new Response(400, 'Mauvaise requête vérifiez les données.'))
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(403).json(new Response(403, 'Email est déjà utilisé'))
        }

        // Hash du mot de passe grace à la lib bcrypt
        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(12))

        //création du document utilisateur dans la base de donnée mongo
        const newUser = await User.create({
            nom,
            prenom,
            email,
            password: hashedPassword,
            createdAt: Date.now(),
        })
        //signature du jsonwebtoken
        const token = jwt.sign({ id: newUser._id }, process.env.JWT)

        return res.status(201).json(new Response(201, { token }))
    } catch (error) {
        console.error(error)
        return res.status(500).json(Response.error)
    }
}
