exports.ENERGY_MAX = 100;

exports.newPlayer = function(id)
{
    return {
        _id: id,
        awards: [],
        records: [],
        factors: [],
        jobbing: {
            lastTime: new Date()
        },
        private: {
            money: 125,
            gold: 12,
            energy: exports.ENERGY_MAX,
            energyMax: exports.ENERGY_MAX
        },
        public: {
            place: 0,
            level: 120
        },
        body: [
            {
                _id: 0,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 1,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 2,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 3,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 4,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 5,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 6,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 7,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 8,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 9,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 10,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 11,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 12,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 13,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 14,
                effect: 0,
                frazzle: 0,
                power: 0
            },
            {
                _id: 15,
                effect: 0,
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
player0.factors.push({_id: 1000, date: new Date()});
player0.factors.push({_id: 1001, date: new Date()});
player0.factors.push({_id: 1002, date: new Date()});

var player1 = exports.newPlayer(1);
player1.awards.push(0);
player1.awards.push(1);
player1.awards.push(2);
player1.factors.push({_id: 1001, date: new Date()});
player1.factors.push({_id: 1002, date: new Date()});

exports.players = [
    player0, player1
];