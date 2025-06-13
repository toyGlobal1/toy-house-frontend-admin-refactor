import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { EyeIcon } from "lucide-react";
import { YouTubeEmbed } from "../ui/YouTubeEmbed";

export function InventoryVideoModal({ videos }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Tooltip color="foreground" size="sm" content="Show videos" className="rounded-md">
        <Button isIconOnly size="sm" onPress={onOpen}>
          <EyeIcon className="size-4" />
        </Button>
      </Tooltip>
      <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="justify-center">Product Videos</ModalHeader>
          <ModalBody className="max-h-[500px] overflow-y-auto pb-4">
            <div className="flex flex-col gap-2">
              {videos.length === 0 ? (
                <p className="text-center text-gray-500">No videos available for this product.</p>
              ) : (
                videos.map((video) => (
                  <YouTubeEmbed
                    key={video.product_video_id}
                    src={video.video_url}
                    className="w-full rounded-xl"
                  />
                ))
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
