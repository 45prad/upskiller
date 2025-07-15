import Category from '../models/Category.js';
import xlsx from 'xlsx';
import fs from 'fs';

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin


export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
};

export const uploadCategoriesFromExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Read the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    // Validate and prepare categories
    const categoriesToCreate = [];
    const errors = [];
    
    for (const [index, row] of data.entries()) {
      try {
        // Basic validation
        if (!row.name || !row.description) {
          throw new Error('Name and description are required');
        }
        
        const categoryData = {
          name: row.name,
          description: row.description,
          imageUrl: row.imageUrl || 'https://via.placeholder.com/150',
          difficulty: ['Beginner', 'Intermediate', 'Advanced'].includes(row.difficulty) 
            ? row.difficulty 
            : 'Intermediate',
          hoursRequired: Number(row.hoursRequired) || 0,
          challengeCount: Number(row.challengeCount) || 0
        };
        
        categoriesToCreate.push(categoryData);
      } catch (error) {
        errors.push({
          row: index + 2, // +2 because Excel rows start at 1 and header is row 1
          error: error.message,
          data: row
        });
      }
    }
    
    if (errors.length > 0 && categoriesToCreate.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'All rows failed validation',
        errors
      });
    }
    
    // Insert categories
    const createdCategories = await Category.insertMany(categoriesToCreate, { ordered: false });
    
    res.status(201).json({
      success: true,
      data: createdCategories,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully created ${createdCategories.length} categories, ${errors.length} failed`
    });
    
  } catch (err) {
    next(err);
  } finally {
    // Clean up the uploaded file
    if (req.file) {
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    }
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};

// In your categoryController.js
export const getCategoriesCount = async (req, res, next) => {
  try {
    const count = await Category.countDocuments();
    res.status(200).json({
      success: true,
      data: {
        count
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};