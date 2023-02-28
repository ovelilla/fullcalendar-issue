import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import esLocale from "@fullcalendar/core/locales/es";
import dayjs from "dayjs";
import { RRule } from "rrule";

const today = new Date();
const dataEvents = [
    {
        id: "4",
        groupId: "4",
        title: "Reunión semanal de ventas",
        allDay: true,
        description: "Tratar temas de ventas de la empresa.",
        rrule: {
            freq: "weekly",
            dtstart: dayjs(new Date(today.getFullYear(), today.getMonth(), 10)).format(),
        },
        duration: "24:00",
    },
];

function App() {
    const [events, setEvents] = useState(dataEvents);
    const calendarRef = useRef();

    const handleDateSelect = (eventInfo) => {};

    const handleEventClick = (eventInfo) => {};

    const handleEventDrop = (eventInfo) => {
        const { id, groupId, title, start, end, allDay, extendedProps, _def } = eventInfo.event;

        const rule = RRule.fromString(_def.recurringDef.typeData.rruleSet.toString());

        const ruleStart = dayjs(rule.options.dtstart);
        const oldEventStart = dayjs(eventInfo.oldEvent.start);
        const eventStart = dayjs(start);
        const newEventStart = ruleStart.add(eventStart.diff(oldEventStart), "ms");
        const dtstart = ruleStart.isSame(oldEventStart) ? dayjs(start) : newEventStart;

        const dropEvent = {
            id,
            title,
            description: extendedProps.description,
            allDay,
            ...(_def.recurringDef && {
                groupId,
                rrule: {
                    freq: rule.options.freq,
                    dtstart: dtstart.format(),
                },
                duration: end - start,
            }),
            ...(!_def.recurringDef && { start, end }),
        };

        setEvents([...events.map((item) => (item.id === dropEvent.id ? dropEvent : item))]);
    };

    const handleEventResize = (eventInfo) => {
        const { id, groupId, title, start, end, allDay, extendedProps, _def } = eventInfo.event;

        const rule = RRule.fromString(_def.recurringDef.typeData.rruleSet.toString());

        const ruleStart = dayjs(rule.options.dtstart);
        const oldEventStart = dayjs(eventInfo.oldEvent.start);
        const eventStart = dayjs(start);
        const newEventStart = ruleStart.add(eventStart.diff(oldEventStart), "ms");
        const dtstart = ruleStart.isSame(oldEventStart) ? dayjs(start) : newEventStart;

        const resizeEvent = {
            id,
            title,
            description: extendedProps.description,
            allDay,
            ...(_def.recurringDef && {
                groupId,
                rrule: {
                    freq: rule.options.freq,
                    dtstart: dtstart.format(),
                },
                duration: end - start,
            }),
            ...(!_def.recurringDef && { start, end }),
        };
        setEvents([...events.map((item) => (item.id === resizeEvent.id ? resizeEvent : item))]);
    };

    return (
        <FullCalendar
            ref={calendarRef}
            plugins={[rrulePlugin, dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView={"dayGridMonth"}
            headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            views={{
                dayGridMonth: {
                    titleFormat: { year: "numeric", month: "long" },
                    dayHeaderFormat: { weekday: "long" },
                },
                timeGridWeek: {
                    titleFormat: { year: "numeric", month: "long", day: "numeric" },
                    dayHeaderFormat: { weekday: "long" },
                },
                timeGridDay: {
                    titleFormat: { year: "numeric", month: "long", day: "numeric" },
                    dayHeaderFormat: { weekday: "long" },
                },
                listDay: {
                    titleFormat: { year: "numeric", month: "long", day: "numeric" },
                    dayHeaderFormat: { weekday: "long" },
                },
                listWeek: {
                    titleFormat: { year: "numeric", month: "long", day: "numeric" },
                    dayHeaderFormat: { weekday: "long" },
                },
                listMonth: {
                    titleFormat: { year: "numeric", month: "long" },
                    dayHeaderFormat: { weekday: "long" },
                },
            }}
            locale={esLocale}
            height="100%"
            events={events}
            slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
                omitZeroMinute: false,
                meridiem: "short",
            }}
            scrollTime="08:00:00"
            nowIndicator={true}
            selectable={true}
            editable={true}
            selectMirror={true}
            unselectAuto={true}
            forceEventDuration={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
        />
    );
}

export default App;
