import {Card, Image, Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";

const Avatar = ({image, isPopOver, title, message}) => {

    const content = (
        <PopoverContent>
          <div className="px-2 py-2">
            <div className="text-small font-bold">{title}</div>
            <div className="text-tiny">{message}</div>
          </div>
        </PopoverContent>
    );

    return (
        <Popover isOpen={isPopOver} placement="bottom-end" color="primary">
            <PopoverTrigger>
                <Card
                isFooterBlurred
                radius="lg"
                className="border-none"
                >
                <Image
                    alt="Woman listing to music"
                    className="object-cover"
                    height={150}
                    src={image}
                    width={150}
                />
                </Card>
            </PopoverTrigger>
            {content}
        </Popover>
    );
}

export default Avatar