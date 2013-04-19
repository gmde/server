exports.factors = [
    {
        _id: 1000,
        group: 'food',
        name: 'food1',
        desc: 'desc',
        img: 'img',
        duration: 3,
        food: { protein: 20, carbs: 30,weight: 100 },
        cost: { money: 10 }
    },
    {
        _id: 1001,
        group: 'food',
        name: 'food2',
        desc: 'desc',
        img: 'img',
        duration: 5,
        food: { protein: 10, carbs: 20,weight: 200 },
        cost: { money: 20 }
    },
    {
        _id: 2000,
        group: 'rest',
        name: 'rest1',
        desc: 'desc',
        img: 'img',
        duration: 5,
        reg: { energy: 0.5, frazzle: 0.5 },
        cost: { money: 20 }
    },
    {
        _id: 2001,
        group: 'rest',
        name: 'rest2',
        desc: 'desc',
        img: 'img',
        duration: 5,
        reg: { energy: 0.6, frazzle: 0.6 },
        cost: { money: 20, gold: 1 }
    },
    {
        _id: 3000,
        group: 'stimulant',
        name: 'stimulant1',
        desc: 'desc',
        img: 'img',
        duration: 8,
        reg: { energy: 1.6, frazzle: 1.6 },
        cost: { money: 20, gold: 2 }
    },
    {
        _id: 3000,
        group: 'stimulant',
        name: 'stimulant2',
        desc: 'desc',
        img: 'img',
        duration: 8,
        reg: { energy: 1.7, frazzle: 1.8 },
        cost: { money: 20, gold: 5 }
    }
];