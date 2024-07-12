<script setup lang="ts">
const getBase64 = (file:any, callback:any) => {
    const reader:any = new FileReader()
    reader.readAsDataURL(file);
    reader.onload = () => {
        const base64Image = reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
        callback(base64Image);
    };
    reader.onerror = (error:any) => console.log('Error: ', error);
}

const query = (payload:any, callback:any) => {
    const imageFile = payload.inputs.image;

    getBase64(imageFile, async (base64Image:string) => {
        payload.inputs.image = base64Image;
        const response = await fetch(
            "https://api-inference.huggingface.co/models/naver-clova-ix/donut-base-finetuned-docvqa",
            {
                headers: {
                    Authorization: "Bearer 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",
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(payload),
            }
        );
        const result = await response.json();
        console.log(result)
        callback(result)
    });
}

const fileOnChange = async (e:any) => {
    const file = e.target.files[0];
    if (!file) {
        return;
    }

    // const templateItems = evaluationTemplate.value.split("\n")
    await templateItems.forEach(async (item:any) => {
        const payload = {
            inputs: {
                image: file,
                question: item
            }
        };
        await query(payload, (result:any) => {
            console.log(result[0].answer)
        });
    })
};

</script>

<template>
    <main class="min-h-screen flex flex-col items-center w-full p-20">
        <div class="flex flex-col items-center w-2/3 space-y-8">
            <h1 
                class="text-6xl text-center leading-xl"
            >
                Leverage the power of AI to avoid legal troubles!
            </h1>
            <div id="analysis-result"></div>

            <p>
                Pick an evaluation template or create your own:
            </p>
            <textarea 
                id="evaluation-template"
                class="border-2 w-full"
                placeholder="
                    Checklist for a general contract:
                    What is the overall purpose and scope of the contract?
                    Who are the parties involved, and what are their roles?
                    What are the obligations and responsibilities of each party?
                    What products, services, or outcomes are expected?
                "></textarea>
            <p id="status"></p>
            
        </div>

        <div 
            class="
                w-1/2 h-[60vh]
                flex flex-col items-center justify-center
                bg-white border rounded-lg shadow-lg
            "
        >
            <div class="h-40[vh]" id="image-container object-contain"></div>
            <label class="custom-file-upload flex flex-col items-center">
                <img 
                    class="upload-icon h-[20vh] object-contain" 
                    src="https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/upload-icon.png"
                />
                <input
                    class="border"
                    id="file-upload" 
                    type="file" 
                    accept="image/*" 
                />
            </label>
            <h2 class="mt-2 text-2xl">Upload Your Legal Documents</h2>
        </div>
    </main>
</template>
