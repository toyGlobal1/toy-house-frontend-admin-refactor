import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FaYoutube } from "react-icons/fa6";
import Swal from "sweetalert2";
import { PRODUCT_INVENTORY_VIDEOS_KEY } from "../../constants/query-key";
import {
  addProductInventoryVideo,
  deleteProductInventoryVideo,
  getProductInventoryVideos,
} from "../../service/product.service";
import { addInventoryVideoSchema } from "../../validations/product.schema";
import { YouTubeEmbed } from "../ui/YouTubeEmbed";

export function InventoryVideoModal({ inventoryId }) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const { data } = useSuspenseQuery({
    queryKey: [PRODUCT_INVENTORY_VIDEOS_KEY, inventoryId],
    queryFn: () => getProductInventoryVideos(inventoryId),
  });

  const videos = data?.product_videos || [];

  return (
    <>
      <Tooltip color="foreground" size="sm" content="Show videos" className="rounded-md">
        <Button isIconOnly size="sm" onPress={onOpen}>
          <FaYoutube className="size-4" />
        </Button>
      </Tooltip>
      <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="justify-center">Product Videos</ModalHeader>
          <ModalBody className="max-h-[500px] overflow-y-auto pb-4">
            <VideoModalGallery videos={videos} inventoryId={inventoryId} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function VideoModalGallery({ videos, inventoryId, onClose }) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(addInventoryVideoSchema),
    defaultValues: {
      product_videos: [{ video_url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "product_videos",
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: addProductInventoryVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INVENTORY_VIDEOS_KEY, inventoryId] });
      onClose();
      addToast({
        title: "Success",
        description: "New video has been added successfully",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to add new video",
        color: "danger",
      });
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      product_inventory_id: inventoryId,
      product_video_requests: data.product_videos.map((video) => ({
        video_url: video.video_url,
      })),
    };
    await mutateAsync(payload);
  };

  const handleFileDelete = async (videoId) => {
    const { isConfirmed } = await Swal.fire({
      showCloseButton: true,
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "question",
      confirmButtonText: "Delete",
    });
    if (isConfirmed) {
      await deleteProductInventoryVideo(videoId);
      queryClient.invalidateQueries({ queryKey: [PRODUCT_INVENTORY_VIDEOS_KEY, inventoryId] });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-2">
        <label htmlFor="product_videos" className="inline-block text-sm">
          Video URLs
        </label>
        {fields.map((field, index) => (
          <div className="my-1" key={field.id}>
            <div className="flex items-center gap-2">
              <Controller
                name={`product_videos.${index}.video_url`}
                control={control}
                render={({ field, fieldState: { error, invalid } }) => (
                  <Input
                    id="product_videos"
                    {...field}
                    size="sm"
                    label={`URL #${index + 1}`}
                    placeholder="https://youtube.com"
                    variant="bordered"
                    className="flex-1"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                  />
                )}
              />
              {fields.length > 1 && (
                <Button
                  isIconOnly
                  type="button"
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() => remove(index)}
                  aria-label="Remove URL"
                  className="self mb-2">
                  <TrashIcon className="size-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between">
          <Button type="button" size="sm" onPress={() => append({ video_url: "" })}>
            <PlusIcon className="size-4" />
            Add More URL
          </Button>
          <Button
            type="submit"
            color="primary"
            size="sm"
            isLoading={isPending}
            disabled={isPending || !formState.isValid}>
            Save
          </Button>
        </div>
      </form>
      <div className="grid grid-cols-2 gap-2">
        {videos.length === 0 ? (
          <p className="text-center text-gray-500">No videos available for this product.</p>
        ) : (
          videos.map((video) => (
            <div key={video.product_video_id} className="relative">
              <YouTubeEmbed src={video.video_url} className="h-[200px] w-full rounded-xl" />
              <button
                onClick={() => handleFileDelete(video.product_video_id)}
                className="absolute right-1 top-1 inline-flex items-center justify-center rounded-full bg-danger p-1 text-danger-foreground">
                <TrashIcon className="size-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
