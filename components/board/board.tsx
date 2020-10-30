import { Fragment, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from '../column/column';

import { Button, Col, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './board.module.scss';

import { dummyData } from '../../dummyData';

const Board = () => {
  const [data, setData] = useState(dummyData);

  /* Handles task dragging. */
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // do nothing if not changing position of task
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    /* If start column equals finish column. */
    if (start === finish) {
      const newTaskIds: number[] = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1); // remove element with source index
      newTaskIds.splice(destination.index, 0, draggableId); // insert at new pos

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newData);
      return;
    }

    /* Moving from one list to another */
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newData = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Row
        gutter={{ xs: 8, sm: 16, md: 24 }}
        className={styles.board_container}
      >
        <Fragment>
          {data.board.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const curTasks = data.tasks;
            const tasks = column.taskIds.map((taskId) => curTasks[taskId]);
            return (
              <Col key={columnId} xs={24} sm={16} md={12} lg={8} xl={4}>
                <Column column={column} tasks={tasks} />
              </Col>
            );
          })}
          <Button shape="circle" icon={<PlusOutlined />} size="large" style={{marginLeft: 10}}></Button>
        </Fragment>
      </Row>
    </DragDropContext>
  );
};

export default Board;
