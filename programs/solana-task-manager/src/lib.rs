pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("5LGPifnzWuU9bqMezaUdYR6AtGJ2ZZAQDV4q891R7Mxi");

#[program]
pub mod solana_task_manager {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        crate::instructions::initialize::handle_initialize(ctx)
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        crate::instructions::increment::handle_increment(ctx)
    }

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        crate::instructions::initialize_user::handle_initialize_user(ctx)
    }

    pub fn create_task(ctx: Context<CreateTask>, title: String, description: String) -> Result<()> {
        crate::instructions::create_task::handle_create_task(ctx, title, description)
    }

    pub fn delete_task(ctx: Context<DeleteTask>, task_id: u64) -> Result<()> {
        crate::instructions::delete_task::handle_delete_task(ctx, task_id)
    }

    pub fn complete_task(ctx: Context<CompleteTask>, task_id: u64) -> Result<()> {
        crate::instructions::complete_task::handle_complete_task(ctx, task_id)
    }

    pub fn update_task(
        ctx: Context<UpdateTask>,
        task_id: u64,
        title: String,
        description: String,
    ) -> Result<()> {
        crate::instructions::update_task::handle_update_task(ctx, task_id, title, description)
    }
}
