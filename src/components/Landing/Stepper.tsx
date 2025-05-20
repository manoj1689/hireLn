import React from 'react'

function Stepper() {
    return (
        <div className='container relative mx-auto pt-12 pb-8 px-4 ' >
            {/* Left Column */}
            <div className="absolute right-2 top-10 flex flex-col gap-4">
                <img src="/images/stepper/image1.png" alt="Image 1" className="w-28" />

            </div>
            <div className="absolute left-10 bottom-10 flex flex-col gap-4">
                <img src="/images/stepper/image2.png" alt="Image 1" className="w-28" />

            </div>



            <div className='flex justify-center items-center mb-4'>
                <span className='text-md md:text-lg font-light px-8 rounded-full text-white bg-gradient-to-tr from-[#63A7D4] to-[#F295BE]  '>
                    AI: A Step Ahead
                </span>
            </div>
            <section >
                <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light bg-gradient-to-tr from-[#63A7D4] via-[#F295BE] to-[#63A7D4] text-center bg-clip-text text-transparent leading-tight pb-2'>
                    Your New Hires, Ready in <span className="font-bold  ">
                        3 Simple Steps
                    </span>

                </div>
            </section>
            <section>
                <div className='my-4 text-sm sm:text-md md:text-lg lg:text-xl text-center md:w-3/4 mx-auto  text-neutral-600'>

                    Experience the future of hiring with our streamlined AI-powered process
                </div>
            </section>

            <section>


                <div className='flex w-full flex-col lg:flex-row gap-4 py-4'>
                    <div className='w-full flex lg:flex-col lg:w-1/3'>
                        <div className="flex flex-col p-4 w-full">
                            <div className='flex'>
                                <div className='w-1/3'>
                                    <span className='text-xl sm:text-2xl md:text-4xl  lg:text-5xl font-bold rounded-full px-4 bg-gray-100 text-pink-400 border-2 border-gray-300 ' >1</span>
                                </div>

                                <div className=' flex w-2/3 '>
                                    <img src="./images/stepper/team.png" alt="team" className='w-32' />
                                </div>
                            </div>

                            <div className='flex lg:w-4/5 mx-auto text-lg text-center  md:text-xl lg:text-2xl mt-4'>AI Candidate Screening</div>
                            <p className='flex  lg:w-4/5 mx-auto  text-neutral-600 text-center text-lg my-4 font-light'>Smart algorithms analyze resumes and match candidates to your requirements instantly</p>
                        </div>
                    </div>
                    <section className='flex justify-center items-center'>
                        {/* Horizontal dots for large screens and above */}
                        <section className='flex max-lg:hidden gap-2 justify-center py-4'>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-100'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-200'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-300'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-200'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-100'></div>
                        </section>

                        {/* Vertical dots for small and medium screens */}
                        <section className='flex flex-col lg:hidden gap-2 items-center py-4'>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-100'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-200'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-300'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-200'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-100'></div>
                        </section>



                    </section>
                    <div className='w-full lg:w-1/3'>
                        <div className="flex flex-col p-4 w-full">
                            <div className='flex'>
                                <div className='w-1/3'>
                                    <span className='text-xl sm:text-2xl md:text-4xl  lg:text-5xl font-bold rounded-full px-4 bg-gray-100 text-pink-400 border-2 border-gray-300 ' >2</span>
                                </div>

                                <div className=' flex w-2/3 '>
                                    <img src="./images/stepper/ai.png" alt="ai" className='w-32' />
                                </div>
                            </div>

                            <div className='flex lg:w-4/5 mx-auto text-lg text-center  md:text-xl lg:text-2xl mt-4'>Automated Interviews & Evaluation
                            </div>
                            <p className='flex  lg:w-4/5 mx-auto  text-neutral-600 text-center text-lg my-4 font-light'>AI-powered interviews assess candidates 24/7, providing comprehensive evaluation reports.</p>
                        </div>
                    </div>
                    <section className='flex justify-center items-center'>
                        {/* Horizontal dots for large screens and above */}
                        <section className='flex max-lg:hidden gap-2 justify-center py-4'>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-100'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-200'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-300'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-200'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-100'></div>
                        </section>

                        {/* Vertical dots for small and medium screens */}
                        <section className='flex flex-col lg:hidden gap-2 items-center py-4'>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-100'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-200'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-300'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-200'></div>
                            <div className='w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full bg-gray-100'></div>
                        </section>



                    </section>
                    <div className="w-full lg:w-1/3">
                        <div className="flex flex-col p-4 w-full">
                            <div className='flex'>
                                <div className='w-1/3'>
                                    <span className='text-xl sm:text-2xl md:text-4xl  lg:text-5xl font-bold rounded-full px-4 bg-gray-100 text-pink-400 border-2 border-gray-300 ' >3</span>
                                </div>

                                <div className=' flex w-2/3 '>
                                    <img src="./images/stepper/grow.png" alt="grow" className='w-32' />
                                </div>
                            </div>

                            <div className='flex lg:w-4/5 mx-auto text-lg text-center  md:text-xl lg:text-2xl mt-4'>Predictive Hiring & Onboarding</div>
                            <p className='flex  lg:w-4/5 mx-auto  text-neutral-600 text-center text-lg my-4 font-light'>
                                Data-driven insights help predict candidate success and streamline onboarding</p>
                        </div>
                    </div>

                </div>

            </section>
        </div>
    )
}

export default Stepper