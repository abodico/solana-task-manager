use anchor_lang::prelude::*;

use crate::constants::{TASK_SEED, USER_PROFILE_SEED};
use crate::error::TaskManagerError;
use crate::state::{TaskAccount, UserProfile};

#[derive(Accounts)]
pub struct CreateTask<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [
            USER_PROFILE_SEED,
            authority.key().as_ref()
        ],
        bump,
        has_one = authority
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(
        init,
        payer = authority,
        space = 8 + TaskAccount::INIT_SPACE,
        seeds = [
            TASK_SEED,
            authority.key().as_ref(),
            user_profile.task_count.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub task: Account<'info, TaskAccount>,

    pub system_program: Program<'info, System>,
}

pub fn handle_create_task(
    ctx: Context<CreateTask>,
    title: String,
    description: String,
) -> Result<()> {
    require!(!title.trim().is_empty(), TaskManagerError::EmptyTitle);

    require!(title.len() <= 50, TaskManagerError::TitleTooLong);

    require!(
        description.len() <= 200,
        TaskManagerError::DescriptionTooLong
    );

    let user_profile = &mut ctx.accounts.user_profile;
    let task = &mut ctx.accounts.task;

    task.authority = ctx.accounts.authority.key();
    task.task_id = user_profile.task_count;
    task.title = title;
    task.description = description;
    task.completed = false;

    user_profile.task_count = user_profile
        .task_count
        .checked_add(1)
        .ok_or(TaskManagerError::TaskCounterOverflow)?;

    Ok(())
}
