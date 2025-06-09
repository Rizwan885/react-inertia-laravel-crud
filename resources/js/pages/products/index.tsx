import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@headlessui/react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CirclePlusIcon, Eye, Pencil, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Manage Products', href: '/products' }];
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    featured_image: string;
    created_at: string;
}

export default function Index({ ...props }: { products: Product[] }) {
    const { products } = props;
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [showAlert, setShowAlert] = useState(flash?.success|| flash?.error?true:false);

    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flashMessage]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {showAlert && flashMessage && (
                    <Alert
                        variant={'default'}
                        className={`${flash?.success ? 'bg-green-800' : flash?.error ? 'bg-red-500' : ''} ml-auto max-w-md text-white`}
                    >
                        <AlertDescription className="text-white">
                            {flash.success ? 'Success!' : 'Error!'} {flashMessage}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="ml-auto">
                    <Link as="button" href={route('products.create')} className=" flex items-center cursor-pointer rounded-lg bg-indigo-800 px-4 py-2 text-white">
                        <CirclePlusIcon className='me-2' />  Add Product
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="border p-4">#</th>
                                <th className="border p-4">Name</th>
                                <th className="border p-4">Description</th>
                                <th className="border p-4">Price</th>
                                <th className="border p-4">Featured Image</th>
                                <th className="border p-4">Created Date</th>
                                <th className="border p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                          {products.length > 0 ?(
                             products.map((product, index) => (
                                <tr key={product.id}>
                                    <td className="border px-4 py-2 text-center">{index + 1}</td>
                                    <td className="border px-4 py-2">{product.name}</td>
                                    <td className="border px-4 py-2">{product.description}</td>
                                    <td className="border px-4 py-2">{product.price}</td>
                                    <td className="border px-4 py-2">
                                      {product.featured_image && ( <img src={`/storage/${product.featured_image}`} alt={product.name} className="h-16 w-16 object-cover" />)}
                                    </td>
                                    <td className="border px-4 py-2">{product.created_at}</td>
                                    <td className="border px-4 py-2">
                                      <Link as='button' href={route('products.show',product.id)} className='bg-sky-600 text-white p-2 rounded-lg hover:opacity-90 cursor-pointer'>
                                      <Eye size={20}/>
                                      </Link>
                                   
                                      <Link as='button' href={route('products.edit',product.id)} className=' ms-2 bg-blue-600 text-white p-2 rounded-lg hover:opacity-90 cursor-pointer'>
                                      <Pencil size={20}/>
                                      </Link>
                                   
                                      <Button as='button' className=' ms-2 bg-red-600 text-white p-2 rounded-lg hover:opacity-90 cursor-pointer'
                                      onClick={
                                        ()=>{
                                          if(confirm("Are you sure you want to delete this product"))
                                          {
                                            router.delete(route('products.destroy',product.id),{preserveScroll:true});
                                          }
                                        }
                                      }
                                      >
                                      <Trash size={20}/>
                                      </Button>
                                    </td>
                                </tr>
                            ))
                          ):(
                            <tr>
                              <td className='text-center py-4 text-md font-bo text-red-700 ' colSpan={7}>No Products Found!</td>
                            </tr>
                          )}
                           
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
