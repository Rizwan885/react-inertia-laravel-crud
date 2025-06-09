import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomTextArea } from '@/components/ui/custom-textarea';
import { Input } from '@/components/ui/input';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Arrow } from '@radix-ui/react-tooltip';
import { ArrowLeft, LoaderCircle } from 'lucide-react';



export default function ProductForm({...props}) {
    const {product,isView,isEdit}=props;
    const breadcrumbs: BreadcrumbItem[] = [
    {
        title: `${isView?"Show":(isEdit? 'Update': 'Create')} Product`,
        href: route('products.create'),
    },
];
    
    const {data,setData,post,put,processing,errors,reset}=useForm({
        name:product?.name || '',
        description:product?.description || '',
        price:product?.price || '',
        featured_image: null as File | null,
         _method: isEdit ? 'PUT' : 'POST',
    });
   
       // Form Submit Handler
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEdit) {
            post(route('products.update', product.id), {
                forceFormData: true,
                onSuccess: () => reset(),
            });
        } else {
            post(route('products.store'), {
                onSuccess: () => reset(),
            });
        }
    };
  

   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setData('featured_image', e.target.files[0]);
    }
};

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
               <div className='ml-auto'>
                 <Link as="button" href={route('products.index')} className='flex items-center  bg-indigo-800 px-4 py-2 rounded-lg text-white cursor-pointer w-fit' >
                  <ArrowLeft className='me-2'/> Back to Products</Link>
               </div>
               <Card>

                <CardHeader>
                    <CardTitle>
                  {`${isView?"Show":(isEdit? 'Update': 'Create')} Product` }
                    </CardTitle>
                </CardHeader>
                    
                    <CardContent>
                        <form onSubmit={submit} className='flex flex-col gap-4'  encType="multipart/form-data">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <label htmlFor="name">Product Name</label>
                                    <Input
                                    value={data.name}
                                    onChange={(e)=>setData('name',e.target.value)}
                                    id='name'
                                    name='name'
                                    type='text'
                                    placeholder='Product Name'
                                    autoFocus
                                    tabIndex={1}
                                    disabled={isView || processing}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                     <label htmlFor="name">Product Description</label>
                                    <CustomTextArea
                                    value={data.description}
                                    onChange={(e)=>setData('description',e.target.value)}
                                    id='description'
                                    name='description'
                                    placeholder='Product Description'
                                    rows={4}
                                    tabIndex={2}   
                                  disabled={isView || processing}
                                 
                                    />
                                <InputError message={errors.description} />

                                </div>
                                 <div className="grid gap-2">
                                    <label htmlFor="name">Product Price</label>
                                    <Input
                                     value={data.price}
                                    onChange={(e)=>setData('price',e.target.value)}
                                    id='price'
                                    name='price'
                                    type='text'
                                    placeholder='Product Price'
                                    autoFocus
                                    tabIndex={3}
                                    disabled={isView || processing}

                                    />
                                     <InputError message={errors.price} />

                                </div>
                                 {!isView  && ( 
                                    <div className="grid gap-2">
                                    <label htmlFor="name">Product Featured Image</label>
                                    <Input
                                    id='featured_image'
                                    name='featured_image'
                                    type='file'
                                    autoFocus
                                    tabIndex={4}
                                    onChange={handleFileUpload}
                                    />
                                    <InputError message={errors.featured_image} />

                                </div>)}

                                { (isView  || isEdit) && product.featured_image && (
                                    <div className="grid gap-2">
                                    <label htmlFor="name">Current Featured Image</label>
                                    <img src={`/storage/${product.featured_image}`} alt={product.featured_image} className='h-40 w-40 rounded-lg border' />
                                    </div>
                                )
                                
                                }
                                
                                {!isView && (   <Button type="submit" className="mt-4 w-fit cursor-pointer" tabIndex={4}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                     {processing ? (isEdit ? 'Updating...':'Creating')
                                      :isEdit ? 'Update': 'Create' 
                                    } Product
                                    </Button> ) }
                                
                            </div>

                        </form>
                    </CardContent>
               
               </Card>
               
            </div>
        </AppLayout>
    );
}
