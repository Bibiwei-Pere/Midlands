import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Add from "../../app/components/assets/images/dashboard/Add.png";
import { Pen, Save, XCircle } from "lucide-react";

const buttonVariants = cva(
  "flex w-auto items-center mx-auto justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gray-950 text-[#FFFFFFB2] border-2 border-gray-600 hover:bg-white hover:text-black hover:border-gray-100",
        secondary: "bg-black text-white border border-black hover:bg-white hover:text-black",
        outline:
          "bg-transparent text-yellow-500 hover:text-white border border-yellow-500 shadow-sm hover:bg-[#FFBE00] hover:border-[#FFBE00] hover:text-white",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 mt-4",
        ghost:
          "max-w-[396px] rounded-[16px] border border-[#FFFFFF1A] bg-[#FFFFFF1A] text-[#FFFFFFB2] font-medium hover:border-white hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        socials:
          "flex hover:text-yellow-600 gap-2 border border-[#C427FB00] items-center bg-gradient-to-b from-[#362A844D] text-[#FFFFFFB2] from-10% via-[#362A844D] via-30% to-[#201F3F00] to-90%",
        buy: "max-w-[200px] flex hover:text-white hover:border-white gap-2 border border-[#C427FB00] items-center bg-gradient-to-r from-[#FFBE00]  from-10% via-[#FFBE00] via-30% to-[#997200] to-90% text-black",
        success: "w-full bg-green-600 hover:border-white hover:text-white mt-4",
      },
      size: {
        default: "h-10 px-8 py-4",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn("", buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

const AddButtonContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-3 mt-2", className)}>
      {children}
    </div>
  )
);
AddButtonContainer.displayName = "AddButtonContainer";

const AddButton = ({ title, onFileChange }: { title: string; onFileChange: (files: File[]) => void }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onFileChange(files); // Call the parent function with the selected files
  };

  return (
    <label className='flex gap-4 items-center overflow-hidden cursor-pointer'>
      <input className='hidden' type='file' multiple name='image' onChange={handleFileChange} />
      <Image src={Add} alt='Add' />
      <p className=' text-yellow-500'>{title}</p>
    </label>
  );
};

const AddButtonSingle = ({
  title,
  onFileChange,
}: {
  title: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event); // Pass the event to the parent
  };

  return (
    <label className='flex gap-4 items-center overflow-hidden cursor-pointer'>
      <input
        className='hidden'
        type='file'
        name='image'
        accept='.png, .jpg, .jpeg' // Restrict file types
        onChange={handleFileChange}
      />
      <Image src={Add} alt='Add' />
      <p className='text-yellow-500'>{title}</p>
    </label>
  );
};

const FileDisplay = ({ files, onRemove }: { files: File[]; onRemove: (index: number) => void }) => {
  const [fileUrls, setFileUrls] = React.useState<string[]>([]);

  // Create object URLs and clean them up when files change
  React.useEffect(() => {
    const newFileUrls = files.map((file) => URL.createObjectURL(file));
    setFileUrls(newFileUrls);

    // Cleanup: Revoke object URLs to avoid memory leaks
    return () => {
      newFileUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]); // Run this effect when files change

  return (
    <div className='flex gap-2 flex-wrap'>
      {fileUrls.map((fileUrl, index) => (
        <div key={index}>
          <XCircle onClick={() => onRemove(index)} className='h-5 w-5 relative top-6 left-1 text-red-700' />
          <Image
            src={fileUrl}
            alt={`file-preview-${index}`}
            width={110}
            height={110}
            className='max-w-[110px] rounded-md h-[110px]'
          />
        </div>
      ))}
    </div>
  );
};

const FileDisplaySingle = ({ file }: { file: File | null }) => {
  if (!file) return null;
  const imageUrl = URL.createObjectURL(file);

  return (
    <div className='w-full'>
      <Image src={imageUrl} alt={`file-preview`} width={110} height={110} className='w-full rounded-md h-[317px]' />
    </div>
  );
};

interface EditToggleButtonProps {
  isEditing: boolean;
  onClick: () => void;
}

const EditToggleButton: React.FC<EditToggleButtonProps> = ({ isEditing, onClick }) => {
  return (
    <div className='flex items-end justify-end'>
      {isEditing ? (
        <Save className='cursor-pointer h-5 hover:text-yellow-500' onClick={onClick} />
      ) : (
        <Pen className='cursor-pointer h-4 hover:text-yellow-500' onClick={onClick} />
      )}
    </div>
  );
};

const EditToggleButton2: React.FC<EditToggleButtonProps> = ({ isEditing, onClick }) => {
  return (
    <div className='flex absolute top-3 right-3 items-end justify-end'>
      {isEditing ? (
        <Save className='cursor-pointer h-5 hover:text-yellow-500' onClick={onClick} />
      ) : (
        <Pen className='cursor-pointer h-4 hover:text-yellow-500' onClick={onClick} />
      )}
    </div>
  );
};

export {
  Button,
  AddButtonContainer,
  EditToggleButton,
  EditToggleButton2,
  AddButton,
  AddButtonSingle,
  FileDisplay,
  FileDisplaySingle,
  buttonVariants,
};
