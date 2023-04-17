const router = require("express").Router;
const Cocurricular = require("../../schemas/cocurricular");
const Placement = require("../../schemas/placement");
const HigherStudy = require("../../schemas/higherStudy");
const Miscellaneous = require("../../schemas/miscellaneous");
const Academic = require("../../schemas/academic");

router.post("/academic", (req, res) => {
    const { title, exam, research, date, desp, marks, link } = req.body.academic;
    try {
        const aca = Academic.create({
            title,
            exam,
            research,
            date,
            desp,
            marks,
            link,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error });
    }
    res.json({ success: true });
});

//======================================== New Cocurricular achievement Api ==============================================================//

router.post("/cocurricular", async (req, res, next) => {
    const { title, institute, date, description, position, proof } = req.body.cocurricular;
    try {
        const coCurr = await Cocurricular.create({
            title,
            institute,
            date,
            description,
            position,
            proof,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error });
    }

    res.json({ success: true });
});

//======================================== New Placement achievement Api ==============================================================//

router.post("/placement", (req, res) => {
    const { company, ctc, sector, desc, current } = req.body.placement;
    try {
        const Plc = Placement.create({
            company,
            ctc,
            sector,
            desc,
            current,
        });
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error });
    }
});

router.post("/higher-studies", async (req, res) => {
    const { institute, field, description, start, end, current } = req.body.higherStudies;
    try {
        const higherStudies = await HigherStudy.create({
            institute,
            field,
            description,
            start,
            end,
            current,
        });
    } catch (err) {
        res.json({ success: false, err });
    }
});

//================================== miscellaneous Api ==========================================================//

router.post("/miscellaneous", (req, res) => {
    const { title, type, description, date } = req.body.miscellaneous;
    try {
        const mis = Miscellaneous.create({
            title,
            type,
            description,
            date,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error });
    }
});

router;

module.exports = router;
