use anchor_lang::prelude::*;

#[error_code]
pub enum TaskManagerError {
    // Counter errors
    #[msg("Only the counter authority can update this counter")]
    Unauthorized,

    #[msg("Counter has reached the maximum value")]
    CounterOverflow,

    // Task errors
    #[msg("Task title cannot be empty")]
    EmptyTitle,

    #[msg("Task title cannot exceed 50 bytes")]
    TitleTooLong,

    #[msg("Task description cannot exceed 200 bytes")]
    DescriptionTooLong,

    #[msg("Task is already completed")]
    TaskAlreadyCompleted,

    #[msg("Task counter overflow")]
    TaskCounterOverflow,
}
