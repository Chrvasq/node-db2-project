exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("cars")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("cars").insert([
        {
          vin: "1234567890ABCDEFG",
          make: "Mitsubishi",
          model: "Lancer",
          mileage: 92000,
          transmissionType: "Manual",
          titleStatus: "Clean"
        },
        {
          vin: "ABCDEFG1234567890",
          make: "Tesla",
          model: "Model3",
          mileage: 2000,
          transmissionType: "Automatic",
          titleStatus: "Clean"
        },
        {
          vin: "1234ABCD567890EFG",
          make: "BMW",
          model: "M240i",
          mileage: 10000,
          transmissionType: "Manual",
          titleStatus: ""
        }
      ]);
    });
};
