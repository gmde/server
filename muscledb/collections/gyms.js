exports.gyms = [
    {
        _id: 0, desc: "Зал 1", img: 'gym0', exercises: [ 0, 1, 2 ], max: 90, delta: 5,
        req: null
    },
    {
        _id: 1, desc: "Зал 2", img: 'gym1', exercises: [ 0, 1, 2, 3 ], max: 140, delta: 2.5,
        req: {
            conditions: [
                { level: 30, friends: 5 },
                { level: 5, friends: 20 },
                { gold: 20 }
            ],
            text: 'В зале тренируются спортсмены весовой категорией свыше 80 кг и несколькими друзьями. Говорят, что в зал пропускают также более легких спортсменов, если у них много друзей'
        }
    },
    {
        _id: 2, desc: "Зал 3", img: 'gym2', exercises: [ 0, 1, 2, 3, 4 ], max: 300, delta: 1.25,
        req: {
            conditions: [
                { level: 50, friends: 15 },
                { level: 30, friends: 30 },
                { level: 10, gold: 100 }
            ],
            text: 'В зале тренируются спортсмены весовой категорией свыше 100 кг и большим количеством друзей. Говорят, что в зал пропускают также более легких спортсменов, если у них очень много друзей'
        }
    }
];
