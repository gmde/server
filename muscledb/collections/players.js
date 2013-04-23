exports.ENERGY_MAX = 100;
exports.MONEY = 125;
exports.GOLD = 12;

exports.newPlayer = function(id)
{
    return {
        _id: id,
        awards: [],
        records: [],
        factors: [],
        jobbing: {
            expire: new Date()
        },
        private: {
            money: exports.MONEY,
            gold: exports.GOLD,
            energy: exports.ENERGY_MAX,
            energyMax: exports.ENERGY_MAX
        },
        public: {
            place: 0,
            level: 120
        },
        fixTime: new Date(),
        body: [
            {
                _id: 0,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 1,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 2,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 3,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 4,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 5,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 6,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 7,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 8,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 9,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 10,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 11,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 12,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 13,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 14,
                stress: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 15,
                stress: 0,
                frazzle: 0,
                power: 0
            }
        ]
    };
};

var player0 = exports.newPlayer(0);
player0.awards.push(0);
player0.awards.push(1);
player0.awards.push(2);

var player1 = exports.newPlayer(1);
player1.awards.push(0);
player1.awards.push(1);
player1.awards.push(2);

exports.players = [
    player0, player1
];