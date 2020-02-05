exports.up = function(knex) {
  return knex.schema.createTable("cars", car => {
    car.increments("id");
    car
      .string("vin", 17)
      .unique()
      .notNullable();
    car.string("make").notNullable();
    car.string("model").notNullable();
    car.decimal("mileage").notNullable();
    car.string("transmissionType");
    car.string("titleStatus");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("cars");
};
