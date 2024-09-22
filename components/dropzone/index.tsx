import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { IoMdClose } from 'react-icons/io';
import ImageView from '../image';

interface DropzoneProps {
    className?: string;
    files: string[];
    setFiles: React.Dispatch<React.SetStateAction<string[]>>;
}

const Dropzone: React.FC<DropzoneProps> = ({ className, files, setFiles }) => {
    const [rejected, setRejected] = useState<File[]>([]);
    const [urlState, setUrlState] = useState<string>("");
    const [openModal, setIsOpenModal] = useState(false);

    const handleOpenImgClick = (url: string) => {
        setUrlState(url);
        setIsOpenModal(true);
    };

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: File[]) => {
        const fileUrls = acceptedFiles.map(file => URL.createObjectURL(file));
        setFiles(prevFiles => [...prevFiles, ...fileUrls]);

        if (rejectedFiles.length) {
            setRejected(prevRejected => [...prevRejected, ...rejectedFiles]);
        }
    }, [setFiles]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        //@ts-ignore
        accept: 'image/*',
        maxFiles: 7,
        //@ts-ignore
        onDrop
    });

    const removeFile = (url: string) => {
        setFiles(files => files.filter(file => file !== url));
        URL.revokeObjectURL(url); // Revoke the URL only when the image is removed
    };

    const removeAll = () => {
        files.forEach(file => URL.revokeObjectURL(file));
        setFiles([]);
        setRejected([]);
    };

    const removeRejected = (file: File) => {
        setRejected(files => files.filter(f => f.name !== file.name));
    };

    return (
        <div className='w-full grow pt-4'>
            {openModal && <ImageView url={urlState} onClose={() => setIsOpenModal(false)} />}
            <div
                {...getRootProps({
                    className: className
                })}
            >
                <input {...getInputProps({ name: 'files' })} />
                <div className='flex flex-col items-center justify-center gap-4 w-full min-h-[100px] text-center h-full outline-dashed rounded-xl px-4'>
                    {isDragActive ? (
                        <p>Thả ảnh ở đây</p>
                    ) : (
                        <p>Nhấn vào đây để thêm ảnh hoặc kéo thả ảnh</p>
                    )}
                </div>
            </div>

            {files.length > 0 && (
                <section className='mt-1 p-2 pb-2 rounded-lg'>
                    <ul className={`mt-2 grid grid-cols-1 gap-6 ${files.length == 1 ? "sm:grid-cols-1" : "sm:grid-cols-2"} min-h-[130px]`}>
                        {files.map((fileUrl, index) => (
                            <li key={index} className='relative h-32 w-full rounded-md px-2 border border-gray-300'>
                                <Image
                                    onClick={() => handleOpenImgClick(fileUrl)}
                                    src={fileUrl}
                                    alt={`uploaded-file-${index}`}
                                    width={100}
                                    height={100}
                                    className='h-full w-full rounded-md object-contain'
                                />
                                <button
                                    type='button'
                                    className='absolute right-3 top-3 bg-red-500 pr-.5 flex h-7 w-7 place-items-center justify-center rounded-full hover:bg-gray-300 text-white'
                                    onClick={() => removeFile(fileUrl)}
                                >
                                    <IoMdClose className='h-5 w-5' />
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default Dropzone;
