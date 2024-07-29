import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import React, {useRef, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Calendar, DollarSign} from "lucide-react";
import Tesseract, {recognize} from 'tesseract.js';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const ExpenseTypePicker = ({ expenseType, setExpenseType }) => {
    return (
        <Select value={expenseType} onValueChange={setExpenseType}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Expense Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="groceries">Groceries</SelectItem>
                <SelectItem value="dining">Dining Out</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="debt">Debt</SelectItem>
                <SelectItem value="investments">Investments</SelectItem>
                <SelectItem value="gifts">Gifts</SelectItem>
                <SelectItem value="other">Other</SelectItem>
            </SelectContent>
        </Select>
    );
}

const PictureUploadPanel = ( {setMoneySpent, setDate} ) => {
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                recognizeText(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const recognizeText = (image) => {
        Tesseract.recognize(
            image,
            'eng',
            {
                logger: (m) => console.log(m),
            }
        ).then(({ data: { text }}) => {
            console.log(text);
            extractInfo(text);
        })
    }

    const extractInfo = (text) => {
        const amountLabelPattern = /(total|amount|subtotal|balance|total due|total amount|合计|总计|总金额)[^\d]*((\d+[\.,])?\d+[\.,]\d{2})/i;
        const amountMatch = text.match(amountLabelPattern);

        const genericAmountPattern = /(\d{1,3}(,\d{3})*|\d+)(\.\d{2})?/g;
        const genericAmountMatch = text.match(genericAmountPattern);

        const amount = amountMatch ? amountMatch[2] : (genericAmountMatch ? genericAmountMatch[0] : 'Not found');

        const datePattern = /\b(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})\b/;
        const dateMatch = text.match(datePattern);

        const formattedDate = dateMatch ? formatDate(dateMatch[0]) : 'Not found';

        setMoneySpent(amount);
        setDate(formattedDate);
    }

    const formatDate = (dateStr) => {
        const [day, month, year] = dateStr.split(/[\/.-]/).map(Number);

        const yyyy = year.length === 2 ? `20${year}` : year.toString();
        const mm = month.toString().padStart(2, '0');
        const dd = day.toString().padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`;
    };

    const handleRemoveImage = () => {
        setPreviewUrl(null);
    };

    return (
        <>
            <div className="w-full h-[250px] border-4 border-dashed rounded-lg flex justify-center items-center">
                <Button
                    type="button"
                    className="px-6 mx-auto bg-white text-black border hover:text-white"
                    onClick={handleButtonClick}
                    >
                    Upload
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={handleFileChange}
                    accept="image/*"
                />
            </div>
            {previewUrl && (
                <div className="relative border rounded-lg">
                    <img src={previewUrl} alt="Preview" className="w-48 h-48 object-cover m-4 rounded-lg" />
                    <button
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 mt-2 mr-2 bg-white rounded-lg px-2 hover:bg-gray-200"
                    >
                        &times;
                    </button>
                </div>
            )}
        </>
    );
}

const UploadReceiptForm = ( {fetchExpenses} ) => {
    const [formData, setFormData] = useState({
        date: null,
        expenseType: '',
        moneySpent: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'moneySpent' ? Number(value) : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.expenseType || !formData.moneySpent || !formData.date) {
            toast.error('Please fill in all fields.');
            return;
        }

        const token = localStorage.getItem('token'); // 获取存储在 localStorage 中的 JWT 令牌

        if (!token) {
            toast.error('User not authenticated.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/expenses', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Expense added successfully!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            // Reset form
            setFormData({
                date: null,
                expenseType: '',
                moneySpent: '',
            });
            fetchExpenses();
        } catch (error) {
            toast.error('Failed to save expense.');
            console.error('Error saving expense:', error);
        }
    };

    const setDate = (date) => {
        setFormData((prevData) => ({
            ...prevData,
            date: date,
        }));
    };

    const setExpenseType = (expenseType) => {
        setFormData((prevData) => ({
            ...prevData,
            expenseType: expenseType,
        }));
    };

    const setMoneySpent = (moneySpent) => {
        setFormData((prevData) => ({
            ...prevData,
            moneySpent: moneySpent,
        }));
    };

    return (
        <>
            <div className="flex">
                <Card className="w-[500px]">
                    <CardHeader>
                        <CardTitle className="text-2xl">Upload Receipt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group space-y-5">
                                    <ExpenseTypePicker expenseType={formData.expenseType} setExpenseType={setExpenseType} />
                                    <PictureUploadPanel setMoneySpent={setMoneySpent} setDate={setDate}/>
                                </div>
                                <div className="flex items-center mt-4 border rounded-lg ps-3">
                                    <DollarSign className="mr-2 text-gray-400" />
                                    <Input
                                        className="border-0 flex-1 focus:ring-0"
                                        type="number"
                                        value={formData.moneySpent}
                                        readOnly
                                    />
                                </div>
                                <div className="flex items-center mt-4 border rounded-lg ps-3">
                                    <Calendar className="mr-2 text-gray-400" />
                                    <Input
                                        className="border-0 flex-1 focus:ring-0"
                                        type="text"
                                        value={formData.date}
                                        readOnly
                                    />
                                </div>
                                <Button className="w-full mt-5" type="submit">Submit</Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default UploadReceiptForm;