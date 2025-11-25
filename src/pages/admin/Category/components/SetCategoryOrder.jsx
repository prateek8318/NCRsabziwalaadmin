import React, { useEffect, useRef, useState } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Avatar, Card, message, Spin } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { getAllCategory, updateCategorySortOrder } from '../../../../services/apiCategory';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function SortableCard({ item, listeners, attributes, setNodeRef, transform, transition }) {
    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className="cursor-pointer"
        >
            <Card
                hoverable
                className="shadow-md rounded-lg"
                bodyStyle={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: 16,
                }}
            >
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-move text-gray-500"
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    <MenuOutlined />
                </div>
                <Avatar size={64} shape="square" src={`${BASE_URL}/${item.image}`} />
                <div>
                    <div className="font-medium text-base">{item.name}</div>
                    <div className="text-sm text-gray-400">Sort Order: {item.sortOrder}</div>
                </div>
            </Card>
        </div>
    );
}

function SortableItem({ item }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item._id });

    return (
        <SortableCard
            item={item}
            listeners={listeners}
            attributes={attributes}
            setNodeRef={setNodeRef}
            transform={transform}
            transition={transition}
        />
    );
}

function SetCategoryOrder() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const prevOrderRef = useRef([]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await getAllCategory();
            const data = res.data || res;
            const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
            setCategories(sorted);
            prevOrderRef.current = sorted.map((item) => item._id);
        } catch (error) {
            console.error(error);
            message.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragOver = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIndex = categories.findIndex(i => i._id === active.id);
        const newIndex = categories.findIndex(i => i._id === over.id);
        const newList = arrayMove(categories, oldIndex, newIndex);
        setCategories(newList);
    };

    const handleDragEnd = async () => {
        const newOrder = categories.map(item => item._id);
        if (JSON.stringify(prevOrderRef.current) === JSON.stringify(newOrder)) return;

        prevOrderRef.current = newOrder;
        setUpdating(true);

        const payload = categories.map((item, idx) => ({
            _id: item._id,
            sortOrder: idx + 1,
        }));

        try {
            await updateCategorySortOrder(payload);
            fetchCategories();
            message.success('Sort order updated!');
        } catch (error) {
            console.error(error);
            message.error('Failed to update order');
        } finally {
            setUpdating(false);
        }
    };

    if (loading || updating) return <Spin fullscreen />;

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Set Category Order</h2>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={categories.map(i => i._id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categories.map((item) => (
                            <SortableItem key={item._id} item={item} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

export default SetCategoryOrder;
