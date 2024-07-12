<script setup lang="ts">
const inputValidation:any = ref(null);
const inputImage:any = ref(null);
const results:any = ref([]);

/*
    Current hardcoded implmentation of a validation database
*/
const templateValidation:any = {
    contract_xs:'What is the overall purpose and scope of the contract?\nWho are the parties involved, and what are their roles?\nAre all terms and definitions clear and unambiguous?',
    contract_md:'What is the overall purpose and scope of the contract?\nWho are the parties involved, and what are their roles?\nAre all terms and definitions clear and unambiguous?\nWhat are the obligations and responsibilities of each party?\nWhat products, services, or outcomes are expected?\nWhat is the payment schedule, including amounts and methods?', 
    contract_xl:'What is the overall purpose and scope of the contract?\nWho are the parties involved, and what are their roles?\nAre all terms and definitions clear and unambiguous?\nWhat are the obligations and responsibilities of each party?\nWhat products, services, or outcomes are expected?\nWhat is the payment schedule, including amounts and methods?\nWhat is the governing law and jurisdiction for the contract?\nAre all regulatory requirements being complied with?\nAre confidentiality and non-disclosure clauses clearly defined?\nHow is the handling and ownership of intellectual property addressed?\nWhat are the liability and indemnity provisions?\nWhat are the terms and conditions for contract termination?\nAre there provisions for unforeseen circumstances (force majeure)?\nWhat is the process for resolving disputes?\nAre there clauses related to arbitration or mediation?\nWhat is the effective date of the contract?\nWhat is the contract duration, and are there any renewal terms?\nWhat are the deadlines and timelines for deliverables and milestones?\nAre the signatures from authorized representatives of all parties included?\nAre witness signatures required, and if so, are they included?\nAre all referenced exhibits, appendices, and schedules included and complete?\nAre there any amendments or changes to the original contract?\nHow are risks allocated between the parties?\nAre insurance requirements and coverage confirmed?\nIs there consistency throughout the contract with no conflicting terms?\nHave all typographical or grammatical errors been checked?\nIs there a need for legal advice to clarify any uncertainties?',
}
const pickedTemplateValidation:any = ref(null);

/*
    Model query handler functions
*/
const running:any = ref(false);
const getBase64 = (file:any, callback:any) => {
    const reader:any = new FileReader()
    reader.readAsDataURL(file);
    reader.onload = () => {
        const base64Image = reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
        inputImage.value = reader.result
        callback(base64Image);
    };
    reader.onerror = (error:any) => console.log('Error: ', error);
}

const query = async (payload:any, callback:any) => {
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
        callback(result)
    });
}

const fileOnChange = async (e:any) => {
    const file = e.target.files[0];
    if (!file) {
        return;
    }

    const validationItems = inputValidation.value.split("\n");
    results.value = [];
    running.value = true;

    await validationItems.forEach(async (item:any) => {
        const payload = {
            inputs: {
                image: file,
                question: item
            }
        };
        await query(payload, (result:any) => {
            results.value.push({
                question: payload.inputs.question,
                answer: result[0].answer
            })
        });
    })
    running.value = false;
};

</script>

<template>
    <main 
        style="background-image: url('gradient.jpeg')"
        class="min-h-screen flex flex-col items-center justify-center w-full p-20"
    >
        <h1 
            class="font-primary text-5xl text-center leading-xl pb-4 font-bold"
        >
            Leverage the power of AI to keep you legally safe!
        </h1>
        <p class="font-primary pb-10">Currently, checkmy.xyz uses the huggingface inference API to perform the analysis. The implementation for fully private use of llm is incoming!</p>
        <div class="flex flex-row space-x-2">
            <div class="flex flex-col items-center space-y-2 bg-white p-8 rounded-xl border-b-4 shadow-xl font-primary">
                <h2 class="mt-2 text-2xl">Pick an Evaluation Template or Create Your Own</h2>
                <div class="flex flex-row space-x-2">
                    <button 
                        v-for="templateName, idx in Object.keys(templateValidation)"
                        @click="inputValidation = templateValidation[templateName]; pickedTemplateValidation = templateName"
                        :class="pickedTemplateValidation == templateName ? 'btn-primary': 'btn-outline'"
                        class="btn btn-xs font-thin"
                    >
                        {{ templateName }}
                    </button>
                </div>
                <textarea 
                    v-model="inputValidation"
                    id="evaluation-template"
                    class="border-2 w-full h-full rounded-lg"
                >
                </textarea>
                <p v-if="pickedTemplateValidation == 'contract_xl'" class="text-error text-xs">
                    warning: since we are calling through the huggingface API, this might not work
                </p>
            </div>
            <div 
                class="flex flex-col items-center space-y-2 bg-white p-8 rounded-xl border-b-4 shadow-xl font-primary"
                v-if="inputValidation"
            >
                <h2 class="mt-2 text-2xl">Upload Your Legal Documents</h2>
                <img 
                    v-if="inputImage"
                    class="upload-icon h-[30vh] object-contain" 
                    :src="inputImage"
                />
                <label class="custom-file-upload flex flex-col items-center">
                    <img 
                        class="upload-icon h-[10vh] object-contain" 
                        src="https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/upload-icon.png"
                    />
                    <input
                        class="border"
                        id="file-upload" 
                        type="file" 
                        accept="image/*" 
                        @change="fileOnChange"
                    />
                </label>
            </div>
        </div>
        <div 
            v-if="results.length > 0 && !running"
            class="w-2/3  mt-4 flex flex-col items-center space-y-2 bg-white p-8 rounded-xl border-b-4 shadow-xl font-primary"
        >
            <h2 class="mt-2 text-2xl">Analyze Result</h2>
            <p
                v-for="result, idx in results"
                :key="`${result}_${idx}`"
            > {{ result.question }} -> {{ result.answer }}</p>
        </div>
        <div v-if="running">Analyzing...</div>
        
    </main>
</template>
