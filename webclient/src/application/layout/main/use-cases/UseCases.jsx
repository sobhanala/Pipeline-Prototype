import {useNavigate} from "react-router-dom";

const UseCases = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/pipeline");
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/pipeline");
    }

    return (
        <main className="container d-flex justify-content-center align-items-center">
            <div className="rounded-3 border-1 border-solid border-orange shadow w-75 d-flex flex-column justify-content-center align-items-center bg-cream px-4 py-3">
                <div className="row">
                    <p className="fw-bold fs-5 ">سناریوهای پیش‌بینی و تحلیل رفتاری در بانکداری دیجیتال و هوشمند</p>
                    <div className="col-12 col-md-6 col-xl-4">
                        <button onClick={handleClick} className="btn bg-orange text-white border-none w-100 my-1 rounded-3">سنجش ریسک اعتباری مشتری</button>
                    </div>
                    <div className="col-12 col-md-6 col-xl-4">
                        <button className="btn bg-orange text-white border-none w-100 my-1 rounded-3" disabled={true}>پیش‌بینی ریزش مشتری</button>
                    </div>
                    <div className="col-12 col-md-6 col-xl-4">
                        <button className="btn bg-orange text-white border-none w-100 my-1 rounded-3" disabled={true}>تشخیص مشتریان مشکوک</button>
                    </div>
                    <div className="col-12 col-md-6 col-xl-4">
                        <button className="btn bg-orange text-white border-none w-100 my-1 rounded-3" disabled={true}>پیشنهاد خدمات هوشمند</button>
                    </div>
                    <div className="col-12 col-md-6 col-xl-4">
                        <button className="btn bg-orange text-white border-none w-100 my-1 rounded-3" disabled={true}>سگمنت‌بندی مشتری</button>
                    </div>
                    <div className="col-12 col-md-6 col-xl-4">
                        <button className="btn bg-orange text-white border-none w-100 my-1 rounded-3" disabled={true}>پیش‌بینی ارزش طول عمر مشتری</button>
                    </div>
                    <div className="col-12 col-md-6 col-xl-4">
                        <button className="btn bg-orange text-white border-none w-100 my-1 rounded-3" disabled={true}>مدیریت احساسات مشتری</button>
                    </div>
                    <div className="col-12 col-md-6 col-xl-4">
                        <button className="btn bg-orange text-white border-none w-100 my-1 rounded-3" disabled={true}>احتمال پیش‌فرض در بازپرداخت اقساط</button>
                    </div>
                    <div className="col-12 col-md-6 col-xl-4">
                        <button className="btn bg-orange text-white border-none w-100 my-1 rounded-3" disabled={true}>پیش‌بینی نیازهای مالی آینده مشتری</button>
                    </div>
                </div>

                <form className="row w-100 mt-4" onSubmit={handleSubmit}>
                    <input type="text" className="form-control" placeholder="دستیار هوشمند"/>
                </form>
            </div>
        </main>
    );
}

export default UseCases;
