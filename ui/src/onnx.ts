import * as ort from "onnxruntime-web";
import modelURI from "../../logreg_sepsis.onnx?url";
import wasmPath from "../node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm?url";

//https://github.com/microsoft/onnxruntime/issues/14493
//https://netron.app/

export async function run() {
    ort.env.wasm.wasmPaths = {
        wasm: wasmPath,
    };
    const session = await ort.InferenceSession.create(modelURI, {
        executionProviders: ["wasm"],
    });
    const float_inputs = new ort.Tensor(
        "float32",
        Float32Array.from([80, 0, 3]),
        [1, 3]
    ); //age, sex, episodes

    const feeds = { float_inputs };
    const output = await session.run(feeds);
    console.log(Number(output.label.data[0]));
}

export class SepsisSurvivalPredictorModel {
    session: ort.InferenceSession | null;
    loaded: boolean;
    onload: () => Promise<void>;
    constructor() {
        this.session = null;
        this.loaded = false;
        this.onload = async () => {};
    }

    async load() {
        ort.env.wasm.wasmPaths = {
            wasm: wasmPath,
        };
        this.session = await ort.InferenceSession.create(modelURI, {
            executionProviders: ["wasm"],
        });
        this.loaded = true;
        await this.onload();
    }
    async unload() {
        this.session = null;
        this.loaded = false;
    }

    async predict(age: number, sex: "male" | "female", episodes: number) {
        if (this.session === null) throw new Error("Model not loaded");
        const float_inputs = new ort.Tensor(
            "float32",
            Float32Array.from([age, sex === "female" ? 1 : 0, episodes]),
            [1, 3]
        );
        const feeds = { float_inputs };
        let output: ort.InferenceSession.OnnxValueMapType;
        try {
            output = await this.session.run(feeds);
        } catch (error) {
            console.error("run", error);
            return;
        }
        return {
            label: Number(output.label.data[0]),
            probabilities: output.probabilities.data,
        }
    }
}
