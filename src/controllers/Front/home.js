const Response = require('../../utils/helpers/response.js')

module.exports = async (req, res) => {
    try {
        
        return res.status(200).sendFile('/html/home.html')

    } catch (error) {
        console.error(error)
        return res.status(500).json(Response.error)
    }
}
