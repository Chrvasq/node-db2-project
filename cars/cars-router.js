const express = require("express");

const db = require("../data/db-config");

const router = express.Router();

// GET all Cars
router.get("/", (req, res) => {
  db("cars")
    .then(cars => {
      res.status(200).json(cars);
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ message: "Failed to retrieve cars" });
    });
});

// GET car by ID
router.get("/:id", validateCarID, (req, res) => {
  res.status(200).json(req.car);
});

// POST (Create) new car
router.post("/", validateCar, (req, res) => {
  const { vin, make, model, mileage, transmissionType, titleStatus } = req;
  const newCar = { vin, make, model, mileage, transmissionType, titleStatus };

  db("cars")
    .insert(newCar)
    .then(async ([id]) => {
      const car = await db("cars")
        .where({ id })
        .first();

      res.status(200).json(car);
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ errorMessage: "Exception", err });
    });
});

// PUT (Update) car
router.put("/:id", validateCarID, validateCar, (req, res) => {
  const { vin, make, model, mileage, transmissionType, titleStatus } = req;
  const { id } = req.car;
  const changes = { vin, make, model, mileage, transmissionType, titleStatus };

  db("cars")
    .where({ id })
    .update(changes)
    .then(async () => {
      const car = await db("cars")
        .where({ id })
        .first();

      res.status(200).json(car);
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ message: "Exception", err });
    });
});

// DELETE car
router.delete("/:id", validateCarID, (req, res) => {
  const { car } = req;
  const { id } = car;

  db("cars")
    .where({ id })
    .del()
    .then(async () => {
      const cars = await db("cars");

      res.status(200).json({ deletedCar: car, cars });
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ message: "Exception", err });
    });
});

// custom middleware
function validateCar(req, res, next) {
  const { vin, make, model, mileage } = req.body;
  const transmissionType = req.body.transmissionType || "";
  const titleStatus = req.body.titleStatus || "";

  Object.keys(req.body).length !== 0
    ? vin && make && model && mileage
      ? vin.length <= 17
        ? ((req.vin = vin),
          (req.make = make),
          (req.model = model),
          (req.mileage = mileage),
          (req.transmissionType = transmissionType),
          (req.titleStatus = titleStatus),
          next())
        : res.status(400).json({
            message: "VIN number must be 17 or less characters. "
          })
      : res
          .status(400)
          .json({ message: "Missing VIN, make, model, or mileage" })
    : res.status(400).json({ message: "Missing required data." });
}

async function validateCarID(req, res, next) {
  const { id } = req.params;

  try {
    const car = await db("cars")
      .where({ id })
      .first();

    car
      ? ((req.car = car), next())
      : res.status(404).json({ errorMessage: "Car ID does not exist." });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ message: "Exception", err });
  }
}
module.exports = router;
