import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCategory = async (_req, res) => {
  try {
    const categories = await prisma.category.findMany();

    if (!categories?.length) {
      return res.status(200).json([]);
    }

    res.json(categories);
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const getCategory = async (req, res) => {
  const { categoryId } = req.params;
  console.log('first');

  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });

    console.log(category);
    if (!category) {
      return res.status(400).json({ message: 'No category found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const createNewCategory = async (req, res) => {
  const { name } = req.body;
  console.log(name);

  if (!name) {
    return res.status(400).json({ message: 'Name field is required' });
  }

  try {
    const duplicateName = await prisma.category.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (duplicateName) {
      return res.status(400).json({ message: 'Duplicate category name' });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    if (category) {
      return res.status(200).json({ message: `New category ${name} created` });
    } else {
      return res.status(400).json({ message: 'Invalid category data received' });
    }
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const updateCategory = async (req, res) => {
  const { categoryId, name } = req.body;
  console.log(req.body);

  if (!categoryId) {
    return res.status(400).json({ message: 'ID field is required' });
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!category) {
      return res.status(400).json({ message: 'Category not found' });
    }

    const oldName = category.name;

    let updates = {};
    if (name) {
      const duplicateName = await prisma.category.findFirst({
        where: {
          name: { equals: name, mode: 'insensitive' },
          id: { not: parseInt(categoryId) },
        },
      });

      if (duplicateName) {
        return res.status(400).json({ message: 'Duplicate name' });
      }
      updates.name = name;
    }

    if (Object.keys(updates).length) {
      await prisma.category.update({
        where: { id: parseInt(categoryId) },
        data: updates,
      });
    }

    if (name && oldName !== name) {
      await prisma.video.updateMany({
        where: { category: oldName },
        data: { category: name },
      });
    }

    res.json({ message: `${name || category.name} successfully updated` });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteCategory = async (req, res) => {
  const { categoryId } = req.body;
  console.log('req.body', req.body);

  if (!categoryId) {
    return res.status(400).json({ message: 'Category ID required' });
  }

  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) },
    });

    if (!category) {
      return res.status(400).json({ message: 'Category not found!' });
    }

    await prisma.category.delete({
      where: { id: parseInt(categoryId) },
    });

    res.json('Category successfully deleted');
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
};