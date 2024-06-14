import { ApiResponse } from "@/services/api/decoders";
import { TrackRequestInterface } from "@/utils/request/index";

export async function prepareFileUploader<Request>(
  uploadFiles: () => TrackRequestInterface<ApiResponse<Request>>,
  additionalData?: Record<string, any>
) {
  const trackedRequestInstance = await uploadFiles();

  const runUpload = async (form: FormData) => {
    if (additionalData) {
      for (const field of Object.keys(additionalData)) {
        form.append(field, additionalData[field]);
      }
    }

    return await trackedRequestInstance.send({ body: form });
  };

  const onAbort = () => trackedRequestInstance.abort();
  const onUploadProgress = trackedRequestInstance.onUploadProgress;

  return { onAbort, runUpload, onUploadProgress };
}
