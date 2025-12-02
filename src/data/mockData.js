export const initialSchools = [
    {
        id: 1,
        name: "共愛学園",
        tracks: [
            { id: 't1-1', name: "学特奨学生", events: [] },
            { id: 't1-2', name: "推薦", events: [] },
            { id: 't1-3', name: "一般", events: [] }
        ]
    },
    {
        id: 2,
        name: "前橋育英",
        tracks: [
            { id: 't2-1', name: "学特Ⅰ", events: [] },
            { id: 't2-2', name: "学特Ⅱ", events: [] },
            { id: 't2-3', name: "推薦", events: [] },
            { id: 't2-4', name: "一般", events: [] }
        ]
    },
    {
        id: 3,
        name: "東農大二",
        tracks: [
            { id: 't3-1', name: "推薦", events: [] },
            { id: 't3-2', name: "学特", events: [] },
            { id: 't3-3', name: "一般", events: [] }
        ]
    },
    {
        id: 4,
        name: "桐生第一",
        tracks: [
            { id: 't4-1', name: "特待", events: [] },
            { id: 't4-2', name: "推薦", events: [] },
            { id: 't4-3', name: "一般", events: [] }
        ]
    },
    {
        id: 5,
        name: "樹徳",
        tracks: [
            { id: 't5-1', name: "学業奨学生", events: [] },
            { id: 't5-2', name: "推薦", events: [] },
            { id: 't5-3', name: "一般", events: [] },
            { id: 't5-4', name: "ＳＵ", events: [] }
        ]
    },
    {
        id: 6,
        name: "常磐",
        tracks: [
            { id: 't6-1', name: "学特", events: [] },
            { id: 't6-2', name: "推薦", events: [] },
            { id: 't6-3', name: "一般", events: [] }
        ]
    },
    {
        id: 7,
        name: "本庄東",
        tracks: [
            { id: 't7-1', name: "単願", events: [] },
            { id: 't7-2', name: "併願", events: [] }
        ]
    },
    {
        id: 8,
        name: "本庄一",
        tracks: [
            { id: 't8-1', name: "単願", events: [] },
            { id: 't8-2', name: "併願", events: [] }
        ]
    },
    {
        id: 9,
        name: "足大附",
        tracks: [
            { id: 't9-1', name: "学特単", events: [] },
            { id: 't9-2', name: "学特併", events: [] },
            { id: 't9-3', name: "併願", events: [] }
        ]
    },
    {
        id: 10,
        name: "群馬公立・定時",
        tracks: [
            { id: 't10-1', name: "共通", events: [] }
        ]
    }
];

export const generateDateRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
};
