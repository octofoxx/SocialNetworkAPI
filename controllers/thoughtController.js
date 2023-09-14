const { User, Thought } = require('../models');

const ThoughtController = {
    // get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find({})
                .select('-__v');
            res.json(thoughts);
        } catch (err) {
            console.error({ message: err });
            res.status(500).json(err);
        }
    },
    // get a single thought by id
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'That thought does not exist' });
            }
            res.json(thought);
        } catch (err) {
            console.error({ message: err });
            res.status(500).json(err);
        }
    },
    // create a thought and attach to user
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );
            res.json(thought);
        } catch (err) {
            console.error({ message: err });
            res.status(500).json(err);
        }
    },
    // update a thought by id
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            )

            if (!thought) {
                return res.status(404).json({ message: 'That thought does not exist' });
            }
            res.json(thought);
        } catch (err) {
            console.error({ message: err });
            res.status(500).json(err);
        }
    },
    // delete a thought by id
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
            if (!thought) {
                return res.status(404).json({ message: 'That thought does not exist' });
            }
            res.json({message: 'Thought gone!'});
        } catch (err) {
            console.error({ message: err });
            res.status(500).json(err);
        }
    },
    // for reactions sub document:
    // create reaction
    async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: req.body } },
                { new: true, runValidators: true }
            )
            if (!thought) {
                return res.status(404).json({ message: 'That thought does not exist' });
            }
            res.json(thought);
        } catch (err) {
            console.error({ message: err });
            res.status(500).json(err);
        }
    },
    // delete a reaction
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { new: true }
            )
            if (!thought) {
                return res.status(404).json({ message: 'That reaction does not exist' });
            }
            res.json({ message: 'Reaction removed!'});
        } catch (err) {
            console.error({ message: err });
            res.status(500).json(err);
        }
    }
}
module.exports = ThoughtController;