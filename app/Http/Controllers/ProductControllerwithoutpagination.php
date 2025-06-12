<?php

namespace App\Http\Controllers;

use Exception;
use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\TryCatch;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\ProductFormRequest;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $products = Product::latest()->get()->map(fn($product) => [
        //     'id' => $product->id,
        //     'name' => $product->name,
        //     'description' => $product->description,
        //     'price' => $product->price,
        //     'featured_image' => $product->featured_image,
        //     'featured_image_original_name' => $product->featured_image_original_name,
        //     'created_at' => $product->created_at->format('d M Y'),
        // ]);
        $products=Product::latest()->paginate(1);
         $products->getCollection()->transform(fn($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'description' => $product->description,
            'price' => $product->price,
            'featured_image' => $product->featured_image,
            'featured_image_original_name' => $product->featured_image_original_name,
            'created_at' => $product->created_at->format('d M Y'),
        ]);
        return Inertia::render('products/index', ['products' => $products]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('products/product-form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductFormRequest $request)
    {

        try {
            $featuredImage = null;
            $featuredImageOriginalName = '';
            if ($request->file('featured_image')) {
                $featuredImage = $request->file('featured_image');
                $featuredImageOriginalName = $featuredImage->getClientOriginalName();
                $featuredImage = $featuredImage->store('products', 'public');
            }
            $product = Product::create(
                [
                    'name' => $request->name,
                    'description' => $request->description,
                    'price' => $request->price,
                    'featured_image' => $featuredImage,
                    'featured_image_original_name' => $featuredImageOriginalName
                ]
            );
            if ($product) {
                return redirect()->route('products.index')->with('success', 'Product creatd successfully');
            } else {
                return redirect()->back()->with('error', 'Unable to create product. Please try again');
            }
        } catch (Exception $e) {
            Log::error('Product creation failed: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return Inertia::render('products/product-form', [
            'product' => $product,
            'isView' => true
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return Inertia::render('products/product-form', [
            'product' => $product,
            'isEdit' => true
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductFormRequest $request, Product $product)
    {
        try {
            if ($product) {
                $product->name = $request->name;
                $product->description = $request->description;
                $product->price = $request->price;

                if ($request->file('featured_image')) {
                    // Delete old image if exists
                    if ($product->featured_image && Storage::disk('public')->exists($product->featured_image)) {
                        Storage::disk('public')->delete($product->featured_image);
                    }

                    // Store new image
                    $featuredImage = $request->file('featured_image');
                    $featuredImageOriginalName = $featuredImage->getClientOriginalName();
                    $storedPath = $featuredImage->store('products', 'public'); // returns path like "products/xyz.png"

                    // Update product fields
                    $product->featured_image = $storedPath;
                    $product->featured_image_original_name = $featuredImageOriginalName;
                }

                $product->save();

                return redirect()->route('products.index')->with('success', 'Product updated successfully');
            }

            return redirect()->back()->with('error', 'Unable to update product. Please try again!');
        } catch (Exception $e) {
            Log::error('Product updation failed' . $e->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            if ($product) {
                $existing_featured_image = 'storage/' . $product->featured_image;
                if ($existing_featured_image) {
                    unlink($existing_featured_image);
                }
                $product->delete();

                return redirect()->back()->with('success', 'Product deleted Successfully');
            } else {
                return redirect()->back()->with('error', 'Unable to delete product.Pleae try again!');
            }
        } catch (Exception $e) {
            Log::error('Product deletion failed' . $e->getMessage());
        }
    }
}
