import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

router.get("/cities/all", RestaurantController.getAllCities);

router.post(
  "/:restaurantId",
  param("restaurantId")
    .isNumber()
    .trim()
    .notEmpty()
    .withMessage("RestaurantId paramenter must be a valid string"),
  RestaurantController.getRestaurant
);

router.post(
  "/search/:city",
  param("city")
    .isNumber()
    .trim()
    .notEmpty()
    .withMessage("City paramenter must be a valid string"),
  RestaurantController.searchRestaurant
);

export default router;
