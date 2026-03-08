const Product = require("../models/product.model");
const Category = require("../models/category.model");

async function createProduct(reqData) {
    let topLevel = await Category.findOne({ name: reqData.topLevelCategory || reqData.topLavelCategory });

    if (!topLevel) {
        topLevel = new Category({
            name: reqData.topLevelCategory || reqData.topLavelCategory,
            level: 1,
        });
        await topLevel.save();
    }

    let secondLevel = await Category.findOne({
        name: reqData.secondLevelCategory || reqData.secondLavelCategory,
        parentCategory: topLevel._id,
    });

    if (!secondLevel) {
        secondLevel = new Category({
            name: reqData.secondLevelCategory || reqData.secondLavelCategory,
            parentCategory: topLevel._id,
            level: 2,
        });
        await secondLevel.save();
    }

    let thirdLevel = await Category.findOne({
        name: reqData.thirdLevelCategory || reqData.thirdLavelCategory,
        parentCategory: secondLevel._id,
    });

    if (!thirdLevel) {
        thirdLevel = new Category({
            name: reqData.thirdLevelCategory || reqData.thirdLavelCategory,
            parentCategory: secondLevel._id,
            level: 3,
        });
        await thirdLevel.save();
    }

    const product = new Product({
        title: reqData.title,
        color: reqData.color,
        description: reqData.description,
        discountedPrices: reqData.discountedPrice || reqData.discountedPrices,
        discountedPercent: reqData.discountPercent || reqData.discountPersent,
        imageUrl: reqData.imageUrl,
        brand: reqData.brand,
        price: reqData.price,
        sizes: reqData.size || reqData.sizes,
        quantity: reqData.quantity,
        category: thirdLevel._id,
    });

    return await product.save();
}

async function deleteProduct(productId) {
    const product = await findProductById(productId);
    await Product.findByIdAndDelete(productId);
    return "Product deleted successfully";
}

async function updateProduct(productId, reqData) {
    return await Product.findByIdAndUpdate(productId, reqData);
}

async function findProductById(id) {
    const product = await Product.findById(id).populate("category").exec();

    if (!product) {
        throw new Error("Product not found with id " + id);
    }
    return product;
}

async function getAllProduct(reqQuery) {
    let { category, color, sizes, minPrice, maxPrice, minDiscount, sort, stock, pageNumber, pageSize, search } = reqQuery;

    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;

    let query = Product.find().populate("category");

    if (search) {
        query = query.where("title").regex(new RegExp(search, "i"));
    }


    if (category) {
        const existCategory = await Category.findOne({ name: category });
        if (existCategory) {
            let categoryIdsToMatch = [existCategory._id];

            if (existCategory.level === 1) {
                const level2 = await Category.find({ parentCategory: existCategory._id });
                const level2Ids = level2.map(c => c._id);
                const level3 = await Category.find({ parentCategory: { $in: level2Ids } });
                categoryIdsToMatch = level3.map(c => c._id);
            } else if (existCategory.level === 2) {
                const level3 = await Category.find({ parentCategory: existCategory._id });
                categoryIdsToMatch = level3.map(c => c._id);
            }

            query = query.where("category").in(categoryIdsToMatch);
        } else {
            return { content: [], currentPage: 1, totalPages: 0 };
        }
    }

    if (color) {
        const colorSet = new Set(color.split(",").map(c => c.trim().toLowerCase()));
        const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
        query = query.where("color").regex(colorRegex);
    }

    if (sizes) {
        const sizesSet = new Set(sizes);
        query = query.where("sizes.name").in([...sizesSet]);
    }

    if (minPrice && maxPrice) {
        query = query.where("discountedPrices").gte(minPrice).lte(maxPrice);
    }

    if (minDiscount) {
        query = query.where("discountedPercent").gt(minDiscount);
    }

    if (stock) {
        if (stock === "in_stock") {
            query = query.where("quantity").gt(0);
        } else if (stock === "out_of_stock") {
            query = query.where("quantity").equals(0);
        }
    }

    if (sort) {
        const sortDirection = sort === "price_high" ? -1 : 1;
        query = query.sort({ discountedPrices: sortDirection });
    }

    const totalProducts = await Product.countDocuments(query.getFilter());
    const skip = (pageNumber - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);

    const products = await query.exec();
    const totalPages = Math.ceil(totalProducts / pageSize);

    return { content: products, currentPage: pageNumber, totalPages };
}

async function createMultipleProduct(products) {
    for (let product of products) {
        await createProduct(product);
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    getAllProduct,
    findProductById,
    createMultipleProduct,
};
