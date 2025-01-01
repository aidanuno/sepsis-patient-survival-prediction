import { Button } from "@/components/ui/button";
import {
    VStack,
    HStack,
    Center,
    Code,
} from "@chakra-ui/react";
import {
    RadioCardItem,
    RadioCardLabel,
    RadioCardRoot,
  } from "@/components/ui/radio-card"
import { Field } from "@/components/ui/field";
import { SepsisSurvivalPredictorModel } from "./onnx";
import { useEffect, useRef, useState } from "react";
import {
    NumberInputField,
    NumberInputRoot,
} from "@/components/ui/number-input";

const items = [
    { value: "female", title: "Female", description: "More likely to survive" },
    { value: "male", title: "Male", description: "Less likely to survive" },
];

function App() {
    const model = useRef<SepsisSurvivalPredictorModel | null>();
    const [age, setAge] = useState(0);
    const [sex, setSex] = useState<"male" | "female">("female");
    const [episodes, setEpisodes] = useState(0);
    const [outcome, setOutcome] = useState<any>({}); //eslint-disable-line
    
    useEffect(() => {
        const loadModel = async () => {
            if (!model.current) {
                model.current = new SepsisSurvivalPredictorModel();
                model.current.onload = async () => {
                    setOutcome(await model.current?.predict(age, sex, episodes));
                }
                model.current.load();
            }
        }

        loadModel();

        return () => {
            model.current?.unload();
            model.current = null;
        };
    }, []);

    useEffect(() => {
        const runModel = async () => {
            if(model.current?.loaded) {
                console.log("running model", age, sex, episodes);
                setOutcome(await model.current.predict(age, sex, episodes));
            };
        };
        runModel();
    }, [
        age, sex, episodes, model.current?.loaded
    ]);

    return (
        <Center
            padding={12}
            background={"teal.50"}
            height="100vh"
            maxWidth={"100vw"}
            colorPalette={"teal"}
        >
            <VStack
                gap={12}
                flexFlow={"column"}
                background={"white"}
                shadow="lg"
                borderRadius={"2xl"}
                padding={12}
                alignItems={"start"}
            >
                <Button variant="surface">Predict survival</Button>
                <Field label="Age">
                    <NumberInputRoot onValueChange={(details) => setAge(details.valueAsNumber)}>
                        <NumberInputField defaultValue={age} />
                    </NumberInputRoot>
                </Field>
                <Field label="Episodes of sepsis">
                    <NumberInputRoot onValueChange={(details) => setEpisodes(details.valueAsNumber)}>
                        <NumberInputField defaultValue={episodes} />
                    </NumberInputRoot>
                </Field>
                {/* eslint-disable-next-line */}
                <RadioCardRoot defaultValue={sex} onValueChange={(details) => setSex(details.value as any)}>
                    <RadioCardLabel>Select sex</RadioCardLabel>
                    <HStack align="stretch">
                        {items.map((item) => (
                            <RadioCardItem
                                label={item.title}
                                description={item.description}
                                key={item.value}
                                value={item.value}
                            />
                        ))}
                    </HStack>
                </RadioCardRoot>
                <Code minWidth={"100%"}>{JSON.stringify(outcome)}</Code>
            </VStack>
        </Center>
    );
}

export default App;
