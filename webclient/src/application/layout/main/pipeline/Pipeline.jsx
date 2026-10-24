import {useRef, useState} from "react";

import "./Pipeline.css";
import {toast} from "react-toastify";
import Modal from "application/library/modal/Modal";
import CustomerRiskService from "services/CustomerRiskService";

const Pipeline = () => {
    const rectangleWidth = 150;
    const rectangleHeight = 70;
    const spacing = 40;
    const startX = 50;
    const startY = 20;

    const rectangles = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        x: startX + i * (rectangleWidth + spacing),
        y: startY,
    }));

    const [hoveredId, setHoveredId] = useState(null);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [isThereAnyResult, setIsThereAnyResult] = useState(false);
    const [isDataPickerModalOpen, setIsDataPickerModalOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [isModalCodeOpen, setIsModalCodeOpen] = useState(false);
    const [showingAnalysisResult, setShowingAnalysisResult] = useState({accuracy: 0, customers: []});
    const [code, setCode] = useState("");

    const selectedFile  = useRef(null);
    const analysisResult = useRef({accuracy: 0, customers: []});

    const getStageText = (stage) => {
        switch (stage) {
            case 1:
                return "داده ورودی";
            case 2:
                return "جایگزینی مقادیر خالی"
            case 3:
                return "نرمال‌ساز"
            case 4:
                return "تصمیم گیر"
            case 5:
                return "خروجی";
            default:
                return `مرحله ${stage}`;
        }
    }

    const handleStageClick = (stage) => {
        if (stage === 1) {
            setIsDataPickerModalOpen(true)
            selectedFile.current = null;
        }
        else if (stage === 5) {
            if (!isThereAnyResult) {
                toast.error("هیچ نتیجه برای نمایش وجود ندارد");
            }
            else {
                setShowingAnalysisResult(analysisResult.current);
                setIsResultModalOpen(true);
            }
        }
        else {
            let newCode = "";
            if (stage === 2)
                newCode = CustomerRiskService.getNullImputerComponentCode();
            else if (stage === 3)
                newCode = CustomerRiskService.getScalerEncoderComponent();
            else if (stage === 4)
                newCode = CustomerRiskService.getClassifierComponent();

            setCode(newCode);
            setIsModalCodeOpen(true);
        }
    }

    const handleAnalysisClick = async () => {
        if (selectedFile.current == null) {
            toast.error("هیچ داده ورودی وجود ندارد");
            return;
        }

        setIsAnalysing(true);
        setIsThereAnyResult(false);

        const result = await CustomerRiskService.analyzeCustomersRisk(selectedFile.current);
        if (result){
            setShowingAnalysisResult(result);
            analysisResult.current = result;
            setIsThereAnyResult(true);
        }
        setIsAnalysing(false);
    }

    const onFileChange = (e) => {
        selectedFile.current = e.target.files[0];
    }

    const onDataSubmit = (e) => {
        e.preventDefault();
        setIsDataPickerModalOpen(false);

        if (selectedFile.current == null) {
            toast.error("هیچ فایلی انتخاب نشده");
            setIsThereAnyResult(false);
        }
    }

    const onFilterChange = (event) => {
        const selectedValue = event.target.value;
        if (!selectedValue) {
            setShowingAnalysisResult(analysisResult.current);
            return;
        }

        const newShowing = analysisResult.current.customers.filter(i => i.label == selectedValue);
        setShowingAnalysisResult({
            accuracy: analysisResult.current.accuracy,
            customers: newShowing
        });
    }

    return (
        <main className="container d-flex flex-column justify-content-center align-items-center">
            <Modal isOpen={isDataPickerModalOpen} onClose={() => setIsDataPickerModalOpen(false)}>
                <form onSubmit={onDataSubmit} className="py-3 px-5 bg-cream rounded-3">
                    <input onChange={onFileChange} className="form-control" type="file" />
                    <button type="submit" className="btn bg-orange text-white border-none w-100 my-1 rounded-3 mt-3">ذخیره</button>
                </form>
            </Modal>

            <Modal className="w-50" isOpen={isResultModalOpen} onClose={() => setIsResultModalOpen(false)}>
                <div className="py-3 px-5 bg-cream rounded-3">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <p className="fw-bold fs-6 mb-0">دقت مدل: {analysisResult.accuracy}</p>
                        <div className="w-50 d-flex">
                            <span className="fw-bold fs-6 ms-2 align-self-center">فیلتر: </span>
                            <select onChange={onFilterChange} className="form-select" name="" id="">
                                <option value=""></option>
                                <option value="false">کم ریسک</option>
                                <option value="true">پر ریسک</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        {showingAnalysisResult.customers.map((customer, index) => (
                            <div  key={index} className={`d-flex justify-content-between ${index %2 ? "bg-orange text-white" : "bg-gray text-black"} rounded-3 mb-2 px-3 py-1`}>
                                <p className="mb-0 fw-bold fs-6">{index+1} :</p>
                                <p className="mb-0 fw-bold fs-6">{!customer.label ? "کم ریسک" : "پر ریسک"}</p>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary w-100 mt-3">دانلود فایل</button>
                    <button onClick={() => setIsResultModalOpen(false)} className="btn btn-success text-white border-none w-100 rounded-3 mt-1">بستن</button>
                </div>
            </Modal>

            <Modal isOpen={isModalCodeOpen} onClose={() => setIsModalCodeOpen(false)}>
                <div className="py-3 px-5 bg-cream rounded-3" dir="ltr">
                    <pre className="border-black border-solid border-1 rounded-3 p-3">
                        {code}
                    </pre>
                    <button className="btn btn-primary w-100">دانلود فایل</button>
                    <button onClick={() => setIsModalCodeOpen(false)} className="btn btn-success text-white border-none w-100 rounded-3 mt-1">بستن</button>
                </div>
            </Modal>

            <h2 className="text-xl mb-5 w-100">پایپلاین تشخیص ریسک اعتباری مشتری</h2>
            <svg width="1100" height="150">
                {rectangles.slice(0, -1).map((rect, index) => {
                    const nextRect = rectangles[index + 1];
                    return (
                        <line
                            key={`line-${index}`}
                            x1={rect.x + rectangleWidth}
                            y1={rect.y + rectangleHeight / 2}
                            x2={nextRect.x}
                            y2={nextRect.y + rectangleHeight / 2}
                            stroke="black"
                            strokeWidth={2}
                        />
                    );
                })}

                {rectangles.map((rect) => {
                    const isHovered = hoveredId === rect.id;

                    let isBusy = isAnalysing;
                    let fillColor = "#4ade80"; // default green
                    if (isHovered) fillColor = "#facc15"; // yellow on hover

                    return (
                        <g
                            key={`rect-${rect.id}`}
                            onMouseEnter={() => setHoveredId(rect.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => handleStageClick(rect.id)}
                            style={{cursor: (rect.id === 1 || rect.id === 5) ? "pointer" : "zoom-in"}}
                        >
                            <rect
                                x={rect.x}
                                y={rect.y}
                                width={rectangleWidth}
                                height={rectangleHeight}
                                fill={fillColor}
                                stroke="black"
                                rx={5}
                                ry={5}
                            />
                            {isBusy ? (
                                <g
                                    transform={`translate(${rect.x + rectangleWidth / 2}, ${
                                        rect.y + rectangleHeight / 2
                                    })`}
                                >
                                    <circle
                                        className="spinner"
                                        cx="0"
                                        cy="0"
                                        r="10"
                                        stroke="black"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray="20 10"
                                    />
                                </g>
                            ) : (
                                <text
                                    x={rect.x + rectangleWidth / 2}
                                    y={rect.y + rectangleHeight / 2 + 5}
                                    fontSize="14px"
                                    textAnchor="middle"
                                    fill="black"
                                    fontWeight="bold"
                                >
                                    {getStageText(rect.id)}
                                </text>
                            )}
                        </g>
                    )
                    })}
            </svg>
            <button onClick={handleAnalysisClick} className="btn border-1 bg-orange text-white px-3 py-2 mb-3 rounded-3" disabled={isAnalysing}>
                شروع آنالیز
            </button>
            <p className={`text-success ${isThereAnyResult ? "" : "invisible"}`}>خروجی آماده شد</p>
        </main>
    );
}

export default Pipeline;
