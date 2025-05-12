const testCtrl = {
    base: async (req, res) => {
        try {
            return res.json({ message: "api working" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
};


module.exports = testCtrl;
