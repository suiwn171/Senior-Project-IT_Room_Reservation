const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getSingleBooking(req, res) {
    const bookingId = parseInt(req.query.bookingId);
    try {
        const booking = await prisma.booking.findUnique({
            where: {
                id: bookingId
            },
            include: {
                booker: true
            }
        });
        if (!booking) {
            res.status(404).json({ message: 'Booking not found...' });
        } else {
            res.json(booking);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

async function updateBooking(req, res) {
    const { bookingData } = req.body;
    if (!bookingData) {
        res.status(400).json({ message: 'Update data missing when submit...' })
    } else {
        try {
            await prisma.booking.update({
                where: {
                    id: bookingData.id
                },
                data: {
                    room: {
                        connect: {
                            id: bookingData.room_id,
                        }
                    },
                    title: bookingData.title,
                    purpose: bookingData.purpose,
                    booked_datetime: new Date(bookingData.booked_datetime),
                    check_in_datetime: bookingData.check_in_datetime,
                    check_out_datetime: bookingData.check_out_datetime,
                    booker: {
                        connectOrCreate: {
                            where: {
                                email: bookingData.booker.email
                            },
                            create: {
                                email: bookingData.booker.email,
                                name: bookingData.booker.name
                            }
                        }
                    }
                }
            });
            console.log(bookingData);
            console.log('Update Success\n----');
            res.status(200).json({ message: 'Update success !' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error...' });
        }
    }
};

async function getBookingList(req, res) {
    const filter = req.query.filter;
    let prepare_query = {
        include: {
            booker: true,
            approvement: true,
        }
    }
    if (filter === 'approve') {
        prepare_query.orderBy = {
            approvement: {
                is_approved: 'asc'
            }
        }
    }
    else if (filter === 'edit') {
        prepare_query.orderBy = {
            approvement: {
                is_approved: 'desc'
            }
        }
    }
    prepare_query.where = {
        advertiseId: null
    }
    const querylinkBook = await prisma.booking.findMany(prepare_query);
    res.json(querylinkBook);
};

async function approveBooking(req, res) {
    const { bookingId } = req.body;
    const update_approve = await prisma.approvement.update({
        where: {
            booking_id: bookingId
        },
        data: {
            is_approved: true,
            approve_datetime: new Date()
        }
    });
    res.status(200).json({ message: 'Approved!', updated: update_approve });
}

async function approveAll(req, res) {
    try {
        await prisma.approvement.updateMany({
            where: {
                is_approved: false,
            },
            data: {
                is_approved: true,
                approve_datetime: new Date()
            }
        });
        res.status(200).json({ message: 'All booking approved...' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error...' });
    }
}

async function deleteBooking(req, res) {
    const { bookingId, reason, advertiseId } = req.query;
    console.log("delete booking: ", bookingId);
    console.log("reason: ", reason);
    const allBookingId = Array.isArray(bookingId) ? bookingId : [bookingId];
    const numericBookingId = allBookingId.map(id => parseInt(id));
    const numericAdvertiseId = parseInt(advertiseId);
    try {
        let whereCondition = {};

        if (numericAdvertiseId) {
            whereCondition = {
                advertiseId: numericAdvertiseId
            };
        } else {
            whereCondition = {
                id: {
                    in: numericBookingId
                }
            };
        }
        let delete_booking = await prisma.booking.findMany({
            where: whereCondition,
            include: {
                booker: true,
                approvement: true,
            }
        });

        if (!delete_booking || delete_booking.length === 0) {
            return res.status(404).json({ message: 'Booking not found...' });
        }

        //delete data
        await prisma.booking.deleteMany({
            where: whereCondition
        });
        console.log('success!');
        // sendDeclineEmail(delete_booking.booker.email, reason);

        // add data to delete history

        if (!advertiseId) {
            for (const eachBooking of delete_booking) {
                await prisma.declineDeleteBooking.create({
                    data: {
                        id: eachBooking.id,
                        booker_name: eachBooking.booker.name,
                        room: eachBooking.room_id,
                        title: eachBooking.title,
                        purpose: eachBooking.purpose,
                        reason: reason,
                        approved: eachBooking.approvement.is_approved,
                        check_in_datetime: eachBooking.check_in_datetime,
                        datetime: new Date(),
                    }
                });
            }
        }
        res.status(200).json({ message: 'This Booking have been deleted or declined...' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}

async function historyList(req, res) {
    try {
        const historyList = await prisma.declineDeleteBooking.findMany();
        if (historyList.length === 0) {
            res.status(404).json({ message: 'No records found...' });
        }
        else {
            res.status(200).json({ data: historyList, message: "requested history..." });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = {
    getSingleBooking,
    getBookingList,
    updateBooking,
    approveBooking,
    approveAll,
    deleteBooking,
    historyList
};
