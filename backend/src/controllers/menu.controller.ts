import { createMenuSchema } from "./../validations/menuValidation";
import { Request, Response } from "express";
import { db } from "../lib/prisma";

export const createMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = createMenuSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.flatten() });
      return;
    }
    const menu = await db.menu.create({
      data: {
        name: result.data.name,
        price: result.data.price,
        description: result.data.description,
        imageUrl: result.data.imageUrl,
        category: result.data.category,
        type: result.data.type,
        restaurantId: result.data.restaurantId,
      },
    });
    res.status(201).json(menu);
    return;
  } catch (error) {
    console.error("Error creatingmenu: ", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
